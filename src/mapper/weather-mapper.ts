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
} from '../types/response.js'
import { WeatherMappingError } from '../http/errors.js'
/**
 * Maps the raw hourly weather response to a list of hourly weather conditions.
 *
 * @param raw - The raw hourly weather response to be mapped.
 * @returns HourlyWeatherConditions[] - The mapped list of hourly weather conditions.
 */
function mapHourly(raw: RawHourlyWeatherResponse): HourlyWeatherConditions[] {
  return mapTimeArray<HourlyWeatherConditions>(raw, 'hourly')
}

/**
 * Maps the raw daily weather response to a list of daily weather conditions.
 *
 * @param raw - The raw daily weather response to be mapped.
 * @returns DailyWeatherConditions[] - The mapped list of daily weather conditions.
 */
function mapDaily(raw: RawDailyWeatherResponse): DailyWeatherConditions[] {
  return mapTimeArray<DailyWeatherConditions>(raw, 'daily')
}

/**
 * Maps the raw minutely 15 weather response to a list of minutely 15 weather conditions.
 *
 * @param raw - The raw minutely 15 weather response to be mapped.
 * @returns Minutely15WeatherConditions[] - The mapped list of minutely 15 weather conditions.
 */
function mapMinutely15(raw: RawMinutelyWeatherResponse): Minutely15WeatherConditions[] {
  return mapTimeArray<Minutely15WeatherConditions>(raw, 'minutely_15')
}

/**
 * Maps the raw current weather response to a current weather conditions object.
 *
 * @param raw - The raw current weather response to be mapped.
 * @returns CurrentWeatherConditions - The mapped current weather conditions.
 */
function mapCurrent(raw: RawCurrentWeatherResponse): CurrentWeatherConditions {
  const { time, interval, ...variables } = raw
  return {
    time: timeToDate(time),
    interval,
    ...variables,
  } as CurrentWeatherConditions
}
/**
 * Transforms a time value (string or number) into a Date object.
 *
 * If the time is a number, it's treated as milliseconds since epoch and multiplied by 1000.
 * If the time is a string, it's parsed directly as an ISO 8601 date string.
 *
 * @param time - The time value to convert, either a number (epoch milliseconds) or a string (ISO 8601 format)
 * @returns {Date} A Date object representing the given time
 */
function timeToDate(time: string | number): Date {
  const date = typeof time === 'number' ? new Date(time * 1000) : new Date(time)

  return date
}

/**
 * Maps an array of time values to an array of Date objects.
 *
 * @param raw - The raw array of time values to be mapped.
 * @param targetType - A human-readable string representing the type of weather data being mapped (e.g., "hourly", "daily").
 * @returns {T[]} An array of mapped time values as Date objects.
 */
function mapTimeArray<T>(raw: RawTimedBlock, targetType: string): T[] {
  const variableKeys = Object.keys(raw).filter((key) => key !== 'time')

  const result: T[] = raw.time.map((time, index) => {
    const date = timeToDate(time)

    const conditions: Record<string, number | string> = {}
    for (const key of variableKeys) {
      const arr = raw[key]
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
    } as T
  })

  return result
}
