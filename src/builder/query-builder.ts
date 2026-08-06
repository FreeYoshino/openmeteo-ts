import {
  HourlyWeatherVariables,
  DailyWeatherVariables,
  CurrentWeatherVariables,
  Minutely15WeatherVariables,
} from '../types/variables.js'

import { TemperatureUnit, WindSpeedUnit, PrecipitationUnit, Timeformat } from '../types/query.js'

/**
 * Fluent builder for constructing type-safe Open-Meteo API query parameters.
 *
 * Use Builder pattern to create query parameters for Open-Meteo API requests.
 * This class provides methods to set required and optional parameters, ensuring type safety and proper formatting.
 */
export class QueryBuilder {
  private params: Map<string, string>

  /**
   * Creates a new QueryBuilder with an empty parameter map.
   */
  constructor() {
    this.params = new Map<string, string>()
  }

  // -----Required Parameters-----
  /**
   * Sets the latitude parameter.
   *
   * Must be between -90 and 90(validated at build time).
   * Accepts a single value or array for multi-location queries.
   *
   * @param v - WGS84 latitude in decimal degrees.
   * @returns The current QueryBuilder instance.
   */
  latitude(v: number | number[]): this {
    this.params.set('latitude', Array.isArray(v) ? v.join(',') : v.toString())
    return this
  }
  /**
   * Sets the longitude parameter.
   *
   * Must be between -180 and 180(validated at build time).
   * Accepts a single value or array for multi-location queries.
   *
   * @param v - WGS84 longitude in decimal degrees.
   * @returns The current QueryBuilder instance.
   */
  longitude(v: number | number[]): this {
    this.params.set('longitude', Array.isArray(v) ? v.join(',') : v.toString())
    return this
  }

  // -----Optional Parameters-----
  /**
   * Sets the elevation parameter.
   *
   * By default, a 90-meter digital elevation model (DEM) is used.
   * This parameter allows you to correctly match weather data to specific mountain peaksor actual site altitudes.
   *
   * @param v - Elevation in meters above sea level.
   *    - `number`: Elevation for a single location.
   *    - `number[]`: Elevations for multiple locations.
   *    - `'nan'`: Disables downscaling and uses the average grid-cell height from the model.
   * @returns The current QueryBuilder instance.
   */
  elevation(v: number | number[] | 'nan'): this {
    this.params.set('elevation', Array.isArray(v) ? v.join(',') : v.toString())
    return this
  }

  /**
   * Sets the hourly weather variables parameter.
   *
   * @param v - An array of HourlyWeatherVariables to include in the query.
   *            (e.g., ['temperature_2m', 'precipitation']).
   * @returns The current QueryBuilder instance.
   */
  hourly(v: HourlyWeatherVariables[]): this {
    this.params.set('hourly', v.join(','))
    return this
  }

  /**
   * Sets the daily weather variables parameter.
   *
   * @param v - An array of DailyWeatherVariables to include in the query.
   *            (e.g., ['temperature_2m_max', 'precipitation_sum']).
   * @returns The current QueryBuilder instance.
   */
  daily(v: DailyWeatherVariables[]): this {
    this.params.set('daily', v.join(','))
    return this
  }

  /**
   * Sets the current weather variables parameter.
   *
   * @param v - An array of CurrentWeatherVariables to include in the query.
   *           (e.g., ['temperature_2m', 'relative_humidity_2m']).
   * @returns The current QueryBuilder instance.
   */
  current(v: CurrentWeatherVariables[]): this {
    this.params.set('current', v.join(','))
    return this
  }

  /**
   * Sets the minutely 15 weather variables parameter.
   *
   * @param v - An array of Minutely15WeatherVariables to include in the query.
   *            (e.g., ['temperature_2m', 'relative_humidity_2m']).
   * @returns The current QueryBuilder instance.
   */
  minutely15(v: Minutely15WeatherVariables[]): this {
    this.params.set('minutely_15', v.join(','))
    return this
  }

  /**
   * Sets the temperature unit parameter.
   *
   * @param v - The temperature unit to use.
   * @returns The current QueryBuilder instance.
   */
  temperatureUnit(v: TemperatureUnit): this {
    this.params.set('temperature_unit', v)
    return this
  }

  /**
   * Sets the wind speed unit parameter.
   *
   * @param v - The wind speed unit to use.
   * @returns The current QueryBuilder instance.
   */
  wind_speedUnit(v: WindSpeedUnit): this {
    this.params.set('wind_speed_unit', v)
    return this
  }

  /**
   * Sets the precipitation unit parameter.
   *
   * @param v - The precipitation unit to use.
   * @returns The current QueryBuilder instance.
   */
  precipitationUnit(v: PrecipitationUnit): this {
    this.params.set('precipitation_unit', v)
    return this
  }

  /**
   * Sets the time format parameter.
   *
   * By default, the API returns timestamps in ISO 8601 format.
   *
   * @param v - The time format to use.
   * @returns The current QueryBuilder instance.
   */
  timeFormat(v: Timeformat): this {
    this.params.set('time_format', v)
    return this
  }

  /**
   * Sets the timezone parameter.
   *
   * @param v - The timezone to use.
   * @returns The current QueryBuilder instance.
   */
  timezone(v: string | 'auto'): this {
    this.params.set('timezone', v)
    return this
  }
}
