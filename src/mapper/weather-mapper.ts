import {
  RawTimedBlock,
  RawHourlyWeatherResponse,
  HourlyWeatherConditions,
  RawDailyWeatherResponse,
  DailyWeatherConditions,
  RawMinutelyWeatherResponse,
  Minutely15WeatherConditions,
  RawCurrentWeatherResponse,
  CurrentWeatherConditions,
  RawWeatherResponse,
  WeatherResponse,
} from '../types/response.js'
import { WeatherMappingError } from '../http/errors.js'
/**
 * Maps the raw hourly weather response to a list of hourly weather conditions.
 *
 * @param raw - The raw hourly weather response to be mapped.
 * @returns {HourlyWeatherConditions[]} - The mapped list of hourly weather conditions.
 */
function mapHourly(raw: RawHourlyWeatherResponse): HourlyWeatherConditions[] {
  return mapTimeArray(raw, 'hourly') as HourlyWeatherConditions[]
}

/**
 * Maps the raw daily weather response to a list of daily weather conditions.
 *
 * @param raw - The raw daily weather response to be mapped.
 * @returns {DailyWeatherConditions[]} - The mapped list of daily weather conditions.
 */
function mapDaily(raw: RawDailyWeatherResponse): DailyWeatherConditions[] {
  return mapTimeArray(raw, 'daily') as DailyWeatherConditions[]
}

/**
 * Maps the raw minutely 15 weather response to a list of minutely 15 weather conditions.
 *
 * @param raw - The raw minutely 15 weather response to be mapped.
 * @returns {Minutely15WeatherConditions[]} - The mapped list of minutely 15 weather conditions.
 */
function mapMinutely15(raw: RawMinutelyWeatherResponse): Minutely15WeatherConditions[] {
  return mapTimeArray(raw, 'minutely_15') as Minutely15WeatherConditions[]
}

/**
 * Maps the raw current weather response to a current weather conditions object.
 *
 * @param raw - The raw current weather response to be mapped.
 * @returns {CurrentWeatherConditions} - The mapped current weather conditions.
 */
function mapCurrent(raw: RawCurrentWeatherResponse): CurrentWeatherConditions {
  const { time, interval, ...variables } = raw

  if (time === undefined) {
    throw new WeatherMappingError('Missing "time" in raw current weather response')
  }

  if (interval === undefined) {
    throw new WeatherMappingError('Missing "interval" in raw current weather response')
  }

  return {
    time: timeToDate(time),
    interval,
    ...variables,
  } as CurrentWeatherConditions
}

/**
 * Maps the raw weather response to the normalized weather response shape.
 *
 * @param raw - The raw weather response returned by the API.
 * @returns {WeatherResponse} - The mapped weather response.
 */
export function mapWeatherResponse(raw: RawWeatherResponse): WeatherResponse {
  return {
    latitude: raw.latitude,
    longitude: raw.longitude,
    elevation: raw.elevation,
    generationtime_ms: raw.generationtime_ms,
    utc_offset_seconds: raw.utc_offset_seconds,
    timezone: raw.timezone,
    timezone_abbreviation: raw.timezone_abbreviation,

    hourly: raw.hourly ? mapHourly(raw.hourly) : undefined,
    hourly_units: raw.hourly_units,
    daily: raw.daily ? mapDaily(raw.daily) : undefined,
    daily_units: raw.daily_units,
    current: raw.current ? mapCurrent(raw.current) : undefined,
    current_units: raw.current_units,
    minutely_15: raw.minutely_15 ? mapMinutely15(raw.minutely_15) : undefined,
    minutely_15_units: raw.minutely_15_units,
  }
}
/**
 * Transforms a time value (string or number) into a Date object.
 *
 * If the time is a number, it's treated as a Unix timestamp in seconds and multiplied by 1000.
 * If the time is a string, it's parsed directly as an ISO 8601 date string.
 *
 * @param time - The time value to convert, either a unix timestamp in seconds or an ISO 8601 formatted string.
 * @returns {Date} - A Date object representing the given time
 */
function timeToDate(time: string | number): Date {
  const date = typeof time === 'number' ? new Date(time * 1000) : new Date(time)

  return date
}

/**
 * Maps an array of time values to an array of Date objects.
 *
 * @param raw - The raw time-series weather data block (e.g. hourly, daily).
 * @param targetType - A human-readable string representing the type of weather data being mapped (e.g., "hourly", "daily").
 * @returns {T[]} - An array of normalized weather condition objects.
 */
function mapTimeArray<K extends string, V = number[]>(
  raw: RawTimedBlock<K, V>,
  targetType: string,
) {
  const variableKeys = Object.keys(raw).filter((key) => key !== 'time')

  const result = raw.time.map((time, index) => {
    const date = timeToDate(time)

    const conditions: Record<string, number | string> = {}
    for (const key of variableKeys) {
      const arr = (raw as Record<string, (number | string)[] | undefined>)[key]
      if (arr === undefined) {
        throw new WeatherMappingError(`Missing key '${key}' in raw ${targetType} response`)
      }
      const value = arr[index]
      if (value === undefined) {
        throw new WeatherMappingError(
          `Missing value for key '${key}' at index ${index} in raw ${targetType} response`,
        )
      }
      conditions[key] = value
    }

    return {
      time: date,
      ...conditions,
    }
  })

  return result
}
