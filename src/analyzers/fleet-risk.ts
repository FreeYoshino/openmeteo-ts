import { HourlyWeatherConditions, WeatherResponse } from '../types/response.js'
import { WeatherAnalyzer } from '../types/analyzer.js'

/**
 * Fleet risk severity levels.
 *
 * @remarks
 * - `'LOW'` — risk score 0–1
 * - `'MEDIUM'` — risk score 2–4
 * - `'HIGH'` — risk score 5+
 */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

/**
 * Per-hourly fleet risk assessment produced by the Fleet Risk Analyzer.
 *
 * Each element in {@link FleetRiskExtension.fleetRisk} corresponds, by index,
 * to the matching entry in the response's `hourly` array.
 */
export interface FleetRiskData {
  /** Overall risk severity derived from {@link riskScore}. */
  riskLevel: RiskLevel

  /** Cumulative risk score. Higher values indicate greater operational risk. */
  riskScore: number

  /** Human-readable list of the weather conditions that contributed to the score. */
  riskFactors: string[]
}

/**
 * Extension added to {@link WeatherResponse} by the Fleet Risk Analyzer.
 *
 * `fleetRisk[i]` aligns with `hourly[i]` by index. When the response has no
 * `hourly` block (e.g. the query did not request hourly variables), `fleetRisk`
 * is an empty array.
 */
export type FleetRiskExtension = {
  fleetRisk: FleetRiskData[]
}

/**
 * Configurable thresholds used to classify risk conditions.
 *
 * All thresholds assume the Open-Meteo API's default response units:
 * precipitation (mm), wind speed (km/h), temperature (°C), snowfall (cm), and
 * visibility (metres). If the query overrides these units (e.g.
 * `windSpeedUnit: 'ms'`), the thresholds must be adjusted accordingly.
 *
 * Default values are derived from established meteorological classifications.
 */
export interface FleetRiskThresholds {
  /**
   * Lower bound for moderate rain (mm/h). Defaults to 2.0.
   * @see WMO CIMO Guide: https://old.wmo.int/extranet/pages/prog/www/IMOP/publications/CIMO-Guide/Prelim_2018_ed/8_I_14_en_MR_tc.pdf
   */
  moderateRain: number

  /**
   * Threshold for heavy rain (mm/h). Defaults to 10.0.
   * @see WMO CIMO Guide: https://old.wmo.int/extranet/pages/prog/www/IMOP/publications/CIMO-Guide/Prelim_2018_ed/8_I_14_en_MR_tc.pdf
   */
  heavyRain: number

  /**
   * Lower bound for moderate wind (km/h). Defaults to 30 (Beaufort force 5).
   * @see Beaufort scale: https://www.canada.ca/en/environment-climate-change/services/general-marine-weather-information/understanding-forecasts/beaufort-wind-scale-table.html
   */
  moderateWind: number

  /**
   * Threshold for strong wind (km/h). Defaults to 50 (Beaufort force 7, "near gale").
   * @see Beaufort scale: https://www.canada.ca/en/environment-climate-change/services/general-marine-weather-information/understanding-forecasts/beaufort-wind-scale-table.html
   */
  strongWind: number

  /**
   * High-temperature threshold (°C). Defaults to 35, a threshold commonly used
   * in national heat-alert systems (dry-bulb air temperature, not the 35°C
   * wet-bulb survival limit).
   */
  heatTemperature: number

  /** Freezing-temperature threshold (°C). Defaults to 0 (freezing point). */
  freezingTemperature: number

  /**
   * Threshold for heavy snow (cm/h). Defaults to 5.
   * @see Avalanche.org snowfall rates: https://avalanche.org/avalanche-encyclopedia/snowpack/snowpack-observations/signs-of-instability-red-flags/heavy-snowfall-or-rain/loading-loading-rate/snowfall-rates/
   */
  heavySnow: number

  /**
   * Low-visibility threshold (metres). Defaults to 1000 (= 1 km), the WMO
   * definition of fog.
   * @see WMO International Cloud Atlas: https://cloudatlas.wmo.int/en/fog-compared-with-mist.html
   */
  lowVisibility: number
}

/**
 * Risk contribution weight for each hazard.
 *
 * These weights are a domain judgement rather than a research-derived figure:
 * there is no standard specifying the relative severity of, e.g., a thunderstorm
 * versus heavy rain. The thresholds themselves are research-backed; the weights
 * encode the relative operational threat each hazard poses to a fleet.
 */
const WEIGHTS = {
  heavyRain: 3,
  moderateRain: 1,
  strongWind: 3,
  moderateWind: 1,
  heat: 2,
  freezing: 2,
  thunderstorm: 4,
  heavySnow: 3,
  lowVisibility: 2,
} as const

/**
 * Default thresholds, derived from established meteorological classifications.
 */
const DEFAULT_THRESHOLDS: FleetRiskThresholds = {
  moderateRain: 2.0,
  heavyRain: 10.0,
  moderateWind: 30.0,
  strongWind: 50.0,
  heatTemperature: 35.0,
  freezingTemperature: 0.0,
  heavySnow: 5.0,
  lowVisibility: 1000.0,
}

/**
 * Creates a Fleet Risk Analyzer that computes per-hourly operational risk.
 *
 * The analyzer is designed for fleet operators (logistics, delivery, taxi) and
 * evaluates each hourly data point against a set of weather thresholds,
 * producing a risk score, a severity level, and the contributing factors.
 *
 * Thresholds are configurable and default to research-backed meteorological
 * values. The analyzer assumes the response uses the API's default units
 * (precipitation mm, wind km/h, temperature °C, snowfall cm, visibility m).
 *
 * @param overrides - Optional partial overrides for the default thresholds.
 * @returns A {@link WeatherAnalyzer} that enriches responses with {@link FleetRiskExtension}.
 *
 * @example
 * const analyzer = createFleetRiskAnalyzer()
 *
 * @example
 * const analyzer = createFleetRiskAnalyzer({ strongWind: 60, heavyRain: 15 })
 */
export function createFleetRiskAnalyzer(
  overrides: Partial<FleetRiskThresholds> = {},
): WeatherAnalyzer<FleetRiskExtension> {
  const thresholds: FleetRiskThresholds = { ...DEFAULT_THRESHOLDS, ...overrides }
  return {
    id: 'fleet-risk-analyzer',
    analyze(data: WeatherResponse): WeatherResponse & FleetRiskExtension {
      const fleetRisk: FleetRiskData[] =
        data.hourly?.map((hourlyData) => assessRisk(hourlyData, thresholds)) ?? []

      return { ...data, fleetRisk }
    },
  }
}

/**
 * Evaluates a single hourly data point against the configured thresholds and
 * returns its risk assessment.
 *
 * Risk contributions are additive; the exact weights are defined in the
 * internal {@link WEIGHTS} constant.
 *
 * @param hourlyData - The hourly conditions to evaluate.
 * @param thresholds - The thresholds used to classify each condition.
 * @returns The risk score, severity level, and contributing factors.
 */
function assessRisk(
  hourlyData: HourlyWeatherConditions,
  thresholds: FleetRiskThresholds,
): FleetRiskData {
  let score = 0
  const factors: string[] = []

  const precipitation = hourlyData.precipitation
  if (precipitation !== undefined) {
    if (precipitation > thresholds.heavyRain) {
      score += WEIGHTS.heavyRain
      factors.push('Heavy Rain')
    } else if (precipitation >= thresholds.moderateRain) {
      score += WEIGHTS.moderateRain
      factors.push('Moderate Rain')
    }
  }

  const windSpeed = hourlyData.wind_speed_10m
  if (windSpeed !== undefined) {
    if (windSpeed > thresholds.strongWind) {
      score += WEIGHTS.strongWind
      factors.push('Strong Wind')
    } else if (windSpeed >= thresholds.moderateWind) {
      score += WEIGHTS.moderateWind
      factors.push('Moderate Wind')
    }
  }

  const temperature = hourlyData.temperature_2m
  if (temperature !== undefined) {
    if (temperature > thresholds.heatTemperature) {
      score += WEIGHTS.heat
      factors.push('Heat')
    } else if (temperature < thresholds.freezingTemperature) {
      score += WEIGHTS.freezing
      factors.push('Freezing')
    }
  }

  const snowfall = hourlyData.snowfall
  if (snowfall !== undefined) {
    if (snowfall > thresholds.heavySnow) {
      score += WEIGHTS.heavySnow
      factors.push('Heavy Snow')
    }
  }

  const visibility = hourlyData.visibility
  if (visibility !== undefined) {
    if (visibility < thresholds.lowVisibility) {
      score += WEIGHTS.lowVisibility
      factors.push('Low Visibility')
    }
  }

  const weatherCode = hourlyData.weather_code
  if (weatherCode !== undefined) {
    if (weatherCode >= 95 && weatherCode <= 99) {
      score += WEIGHTS.thunderstorm
      factors.push('Thunderstorm')
    }
  }

  return {
    riskLevel: toRiskLevel(score),
    riskScore: score,
    riskFactors: factors,
  }
}

/**
 * Maps a cumulative risk score to a {@link RiskLevel}.
 *
 * @param score - The cumulative risk score.
 * @returns The corresponding risk level:
 *   `0–1` → `'LOW'`, `2–4` → `'MEDIUM'`, `5+` → `'HIGH'`.
 */
function toRiskLevel(score: number): RiskLevel {
  if (score <= 1) return 'LOW'
  if (score <= 4) return 'MEDIUM'
  return 'HIGH'
}
