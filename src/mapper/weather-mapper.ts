import { RawHourlyWeatherResponse, HourlyWeatherConditions } from '../types/response.js'
import { WeatherMappingError } from '../http/errors.js'
/**
 * Maps the raw hourly weather response to a list of hourly weather conditions.
 *
 * @param raw - The raw hourly weather response to be mapped.
 * @returns HourlyWeatherConditions[] - The mapped list of hourly weather conditions.
 */
function mapHourly(raw: RawHourlyWeatherResponse): HourlyWeatherConditions[] {
  const variableKeys = Object.keys(raw).filter((key) => key !== 'time')

  const result: HourlyWeatherConditions[] = raw.time.map((time, index) => {
    const date = timeToDate(time)

    const conditions: Record<string, number | string> = {}
    variableKeys.forEach((key) => {
      if (raw[key] === undefined) {
        throw new WeatherMappingError(`Missing key '${key}' in raw response`)
      }

      const value = raw[key][index]
      if (value === undefined) {
        throw new WeatherMappingError(`Missing value for key '${key}' at index ${index}`)
      }
      conditions[key] = value
    })

    return {
      time: date,
      ...conditions,
    }
  })

  return result
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
