import type {
  HourlyWeatherVariables,
  DailyWeatherVariables,
  CurrentWeatherVariables,
  Minutely15WeatherVariables,
} from './variables.js'

/**
 * Defines the types for the API response data returned by the Open-Meteo API.
 *
 * API Documentation: https://open-meteo.com/en/docs
 */

/**
 * Raw response structure returned by the Open-Meteo Weather Forecast API.
 *
 * Contains metadata about the requested location, along with hourly, daily,
 * current, and minutely_15 weather data blocks.
 */
export interface RawWeatherResponse {
  /**
   * WGS84 latitude coordinate of the requested location.
   *
   * @example 37.7749
   */
  latitude: number

  /**
   * WGS84 longitude coordinate of the requested location.
   *
   * @example -122.4194
   */
  longitude: number

  /**
   * Elevation in meters above sea level of the resolved location.
   *
   * @example 150
   */
  elevation: number

  /**
   * Time taken to generate the forecast in milliseconds.
   *
   * @example 42.5
   */
  generationtime_ms: number

  /**
   * Timezone offset from UTC in seconds for the resolved location.
   *
   * @example -18000
   */
  utc_offset_seconds: number

  /**
   * IANA timezone identifier for the resolved location.
   *
   * @example 'America/New_York'
   */
  timezone: string

  /**
   * Abbreviated timezone name for the resolved location.
   *
   * @example 'EST'
   */
  timezone_abbreviation: string

  /**
   * Hourly weather data for the requested time range.
   *
   * Included only when {@link QueryParams.hourly} parameters are requested.
   */
  hourly?: RawHourlyWeatherResponse

  /**
   * Units for each hourly weather variable.
   *
   * Keys correspond to the requested hourly variable names, values are the unit strings.
   *
   * @example { temperature_2m: '°C', relative_humidity_2m: '%' }
   */
  hourly_units?: Record<string, string>

  /**
   * Daily weather data for the requested time range.
   *
   * Included only when {@link QueryParams.daily} parameters are requested.
   */
  daily?: RawDailyWeatherResponse

  /**
   * Units for each daily weather variable.
   *
   * Keys correspond to the requested daily variable names, values are the unit strings.
   *
   * @example { temperature_2m_max: '°C', temperature_2m_min: '°C' }
   */
  daily_units?: Record<string, string>

  /**
   * Current weather data for the requested location.
   *
   * Included only when {@link QueryParams.current} parameters are requested.
   */
  current?: RawCurrentWeatherResponse

  /**
   * Units for each current weather variable.
   *
   * Keys correspond to the requested current variable names, values are the unit strings.
   *
   * @example { temperature_2m: '°C', wind_speed_10m: 'km/h' }
   */
  current_units?: Record<string, string>

  /**
   * Minutely (15-minute interval) weather data for the requested time range.
   *
   * Included only when {@link QueryParams.minutely_15} parameters are requested.
   */
  minutely_15?: RawMinutelyWeatherResponse

  /**
   * Units for each minutely_15 weather variable.
   *
   * Keys correspond to the requested minutely_15 variable names, values are the unit strings.
   *
   * @example { temperature_2m: '°C', precipitation: 'mm' }
   */
  minutely_15_units?: Record<string, string>
}

/**
 * Raw hourly weather data block returned by the API.
 *
 * Each key (except `time`) corresponds to a requested hourly weather variable,
 * with values as arrays of numbers representing the data at each timestep.
 */
export interface RawHourlyWeatherResponse {
  /**
   * Array of ISO 8601 formatted time strings representing each hourly timestep.
   *
   * @example ['2023-01-01T00:00', '2023-01-01T01:00', '2023-01-01T02:00']
   */
  time: string[]

  /**
   * Additional weather variable data arrays, keyed by variable name.
   *
   * Each key is a weather variable (e.g., 'temperature_2m', 'relative_humidity_2m')
   * with a numeric array where each element corresponds to the timestep at the same index
   * in the {@link time} array.
   *
   * @example
   * // Accessing temperature data
   * response.hourly['temperature_2m'] // => [12.5, 13.1, 13.8, ...]
   */
  [key: string]: number[] | string[]
}

/**
 * Raw daily weather data block returned by the API.
 *
 * Each key (except `time`) corresponds to a requested daily weather variable,
 * with values as arrays of numbers representing the data for each day.
 */
export interface RawDailyWeatherResponse {
  /**
   * Array of ISO 8601 formatted date strings representing each daily timestep.
   *
   * @example ['2023-01-01', '2023-01-02', '2023-01-03']
   */
  time: string[]

  /**
   * Additional weather variable data arrays, keyed by variable name.
   *
   * Each key is a weather variable (e.g., 'temperature_2m_max', 'precipitation_sum')
   * with a numeric array where each element corresponds to the day at the same index
   * in the {@link time} array.
   *
   * @example
   * // Accessing daily max temperature data
   * response.daily['temperature_2m_max'] // => [15.2, 14.8, 16.1, ...]
   */
  [key: string]: number[] | string[]
}

/**
 * Raw current weather data block returned by the API.
 *
 * Contains scalar values (not arrays) for the current conditions at the requested location.
 * Each key (except `time`) corresponds to a requested current weather variable.
 */
export interface RawCurrentWeatherResponse {
  /**
   * ISO 8601 formatted time string representing the timestamp of the current conditions.
   *
   * @example '2023-01-01T12:00'
   */
  time: string

  /**
   * Additional current weather variable values, keyed by variable name.
   *
   * Each key is a weather variable (e.g., 'temperature_2m', 'wind_speed_10m')
   * with a single numeric or string value representing the current reading.
   * Unlike hourly and daily data, current values are scalars, not arrays.
   *
   * @example
   * // Accessing current temperature
   * response.current['temperature_2m'] // => 22.5
   */
  [key: string]: number | string
}

/**
 * Raw minutely (15-minute interval) weather data block returned by the API.
 *
 * Each key (except `time`) corresponds to a requested minutely_15 weather variable,
 * with values as arrays of numbers representing the data at each 15-minute timestep.
 */
export interface RawMinutelyWeatherResponse {
  /**
   * Array of ISO 8601 formatted time strings representing each 15-minute timestep.
   *
   * @example ['2023-01-01T00:00', '2023-01-01T00:15', '2023-01-01T00:30']
   */
  time: string[]

  /**
   * Additional weather variable data arrays, keyed by variable name.
   *
   * Each key is a weather variable (e.g., 'temperature_2m', 'precipitation')
   * with a numeric array where each element corresponds to the timestep at the same index
   * in the {@link time} array.
   *
   * @example
   * // Accessing 15-minute precipitation data
   * response.minutely_15['precipitation'] // => [0.0, 0.2, 0.5, ...]
   */
  [key: string]: number[] | string[]
}

/**
 * Normalized weather response structure returned by the Open-Meteo Weather Forecast API.
 *
 * Each weather data block (hourly, daily, current, minutely_15) has been normalized
 * so that each weather variable maps directly to a typed numeric value, and time values
 * are converted from string arrays into native {@link Date} objects.
 *
 * All data blocks are optional and only included when the corresponding query
 * parameters are requested.
 */
export interface WeatherResponse {
  /**
   * WGS84 latitude coordinate of the requested location.
   *
   * @example 37.7749
   */
  latitude: number

  /**
   * WGS84 longitude coordinate of the requested location.
   *
   * @example -122.4194
   */
  longitude: number

  /**
   * Elevation in meters above sea level of the resolved location.
   *
   * @example 150
   */
  elevation: number

  /**
   * Time taken to generate the forecast in milliseconds.
   *
   * @example 42.5
   */
  generationtime_ms: number

  /**
   * Timezone offset from UTC in seconds for the resolved location.
   *
   * @example -18000
   */
  utc_offset_seconds: number

  /**
   * IANA timezone identifier for the resolved location.
   *
   * @example 'America/New_York'
   */
  timezone: string

  /**
   * Abbreviated timezone name for the resolved location.
   *
   * @example 'EST'
   */
  timezone_abbreviation: string

  /**
   * Normalized hourly weather data array.
   *
   * Each element represents a single hourly timestep with typed weather variables.
   * The `time` field has been converted from an ISO 8601 string to a native {@link Date} object.
   *
   * Included only when {@link QueryParams.hourly} parameters are requested.
   */
  hourly?: HourlyWeatherConditions[]

  /**
   * Units for each hourly weather variable.
   *
   * Keys correspond to the requested hourly variable names, values are the unit strings.
   *
   * @example { temperature_2m: '°C', relative_humidity_2m: '%' }
   */
  hourly_units?: Record<string, string>

  /**
   * Normalized daily weather data array.
   *
   * Each element represents a single day with typed weather variables.
   * The `time` field has been converted from an ISO 8601 date string to a native {@link Date} object.
   *
   * Included only when {@link QueryParams.daily} parameters are requested.
   */
  daily?: DailyWeatherConditions[]

  /**
   * Units for each daily weather variable.
   *
   * Keys correspond to the requested daily variable names, values are the unit strings.
   *
   * @example { temperature_2m_max: '°C', temperature_2m_min: '°C' }
   */
  daily_units?: Record<string, string>

  /**
   * Normalized current weather conditions.
   *
   * Contains a single object (not an array) with typed weather variables
   * representing the latest observed conditions.
   * The `time` field has been converted from an ISO 8601 string to a native {@link Date} object.
   *
   * Included only when {@link QueryParams.current} parameters are requested.
   */
  current?: CurrentWeatherConditions

  /**
   * Units for each current weather variable.
   *
   * Keys correspond to the requested current variable names, values are the unit strings.
   *
   * @example { temperature_2m: '°C', wind_speed_10m: 'km/h' }
   */
  current_units?: Record<string, string>

  /**
   * Normalized minutely (15-minute interval) weather data array.
   *
   * Each element represents a single 15-minute timestep with typed weather variables.
   * The `time` field has been converted from an ISO 8601 string to a native {@link Date} object.
   *
   * Included only when {@link QueryParams.minutely_15} parameters are requested.
   */
  minutely_15?: Minutely15WeatherConditions[]

  /**
   * Units for each minutely_15 weather variable.
   *
   * Keys correspond to the requested minutely_15 variable names, values are the unit strings.
   *
   * @example { temperature_2m: '°C', precipitation: 'mm' }
   */
  minutely_15_units?: Record<string, string>
}

/**
 * Mapped type that constrains the keys of an object to valid
 * {@link HourlyWeatherVariables} with numeric values.
 *
 * Used as the base for {@link HourlyWeatherConditions} to ensure type-safe
 * access to hourly weather variable data.
 */
type HourlyConditions = {
  [K in HourlyWeatherVariables]?: number
}

/**
 * Mapped type that constrains the keys of an object to valid
 * {@link DailyWeatherVariables} with numeric values.
 *
 * Used as the base for {@link DailyWeatherConditions} to ensure type-safe
 * access to daily weather variable data.
 */
type DailyConditions = {
  [K in DailyWeatherVariables]?: number | string
}

/**
 * Mapped type that constrains the keys of an object to valid
 * {@link CurrentWeatherVariables} with numeric values.
 *
 * Used as the base for {@link CurrentWeatherConditions} to ensure type-safe
 * access to current weather variable data.
 */
type CurrentConditions = {
  [K in CurrentWeatherVariables]?: number
}

/**
 * Mapped type that constrains the keys of an object to valid
 * {@link Minutely15WeatherVariables} with numeric values.
 *
 * Used as the base for {@link Minutely15WeatherConditions} to ensure type-safe
 * access to 15-minute interval weather variable data.
 */
type Minutely15Conditions = {
  [K in Minutely15WeatherVariables]?: number
}

/**
 * Normalized hourly weather conditions for a single timestep.
 *
 * Extends {@link HourlyConditions} to include a `time` field representing
 * the timestamp of this observation, converted to a native {@link Date} object.
 */
export interface HourlyWeatherConditions extends HourlyConditions {
  /**
   * Timestamp of this hourly observation as a native {@link Date} object.
   *
   * Converted from the raw ISO 8601 string in the API response.
   *
   * @example new Date('2023-01-01T12:00')
   */
  time: Date
}

/**
 * Normalized daily weather conditions for a single day.
 *
 * Extends {@link DailyConditions} to include a `time` field representing
 * the date of this observation, converted to a native {@link Date} object.
 */
export interface DailyWeatherConditions extends DailyConditions {
  /**
   * Date of this daily observation as a native {@link Date} object.
   *
   * Converted from the raw ISO 8601 date string in the API response.
   *
   * @example new Date('2023-01-01')
   */
  time: Date
}

/**
 * Normalized current weather conditions at the requested location.
 *
 * Extends {@link CurrentConditions} to include a `time` field and an `interval`
 * field indicating the measurement interval in seconds.
 */
export interface CurrentWeatherConditions extends CurrentConditions {
  /**
   * Timestamp of the current observation as a native {@link Date} object.
   *
   * Converted from the raw ISO 8601 string in the API response.
   *
   * @example new Date('2023-01-01T12:00')
   */
  time: Date

  /**
   * Measurement interval for the current conditions in seconds.
   *
   * Indicates the time window over which the current observation was sampled.
   *
   * @example 900
   */
  interval: number
}

/**
 * Normalized 15-minute interval weather conditions for a single timestep.
 *
 * Extends {@link Minutely15Conditions} to include a `time` field.
 */
export interface Minutely15WeatherConditions extends Minutely15Conditions {
  /**
   * Timestamp of this 15-minute observation as a native {@link Date} object.
   *
   * Converted from the raw ISO 8601 string in the API response.
   *
   * @example new Date('2023-01-01T12:00')
   */
  time: Date
}
