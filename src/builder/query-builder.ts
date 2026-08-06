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

  /**
   * Sets the past days parameter.
   *
   * This parameter allows you to retrieve historical weather data for a specified number of past days.
   * By default, a value of 0 is used, which means no historical data will be included in the response.
   * Must be between 0 and 92 (validated at build time).
   *
   * @param v - The number of past days to include in the query.
   * @returns The current QueryBuilder instance.
   */
  pastDays(v: number): this {
    this.params.set('past_days', v.toString())
    return this
  }

  /**
   * Sets the past hours parameter.
   *
   * This parameter allows you to retrieve historical weather data for a specified number of past hours.
   * Must be greater than 0 (validated at build time).
   *
   * @param v - The number of past hours to include in the query.
   * @returns The current QueryBuilder instance.
   */
  pastHours(v: number): this {
    this.params.set('past_hours', v.toString())
    return this
  }

  /**
   * Sets the forecast days parameter.
   *
   * This parameter allows you to retrieve forecast weather data for a specified number of future days.
   * Must be between 1 and 16 (validated at build time).
   * By default, a value of 7 is used, which means the API will return forecast data for the next 7 days.
   *
   * @param v - The number of forecast days to include in the query.
   * @returns The current QueryBuilder instance.
   */
  forecastDays(v: number): this {
    this.params.set('forecast_days', v.toString())
    return this
  }

  /**
   * Sets the forecast hours parameter.
   *
   * This parameter allows you to retrieve forecast weather data for a specified number of future hours.
   * Must be greater than 0 (validated at build time).
   *
   * @param v - The number of forecast hours to include in the query.
   * @returns The current QueryBuilder instance.
   */
  forecastHours(v: number): this {
    this.params.set('forecast_hours', v.toString())
    return this
  }

  /**
   * Sets the start date parameter.
   *
   * This parameter allows you to specify the start date for the query.
   * Must be in the format 'YYYY-MM-DD' (validated at build time).
   *
   * @param v - The start date to use.
   * @returns The current QueryBuilder instance.
   */
  startDate(v: string): this {
    this.params.set('start_date', v)
    return this
  }

  /**
   * Sets the end date parameter.
   *
   * This parameter allows you to specify the end date for the query.
   * Must be in the format 'YYYY-MM-DD' (validated at build time).
   *
   * @param v - The end date to use.
   * @returns The current QueryBuilder instance.
   */
  endDate(v: string): this {
    this.params.set('end_date', v)
    return this
  }

  /**
   * Sets the tilt angle for global_tilted_irradiance(GTI) calculations.
   *
   * Represents the angle of the solar panel relative to horizontal ground.
   * By default, a value of 0 is used, which means the panel is lying flat.
   *
   * @param v - The tilt angle in degrees to use .
   * @returns The current QueryBuilder instance.
   */
  tilt(v: number): this {
    this.params.set('tilt', v.toString())
    return this
  }

  /**
   * Sets the azimuth angle for global_tilted_irradiance(GTI) calculations.
   *
   * Represents the compass direction the solar panel faces:
   * - North=0, East=90, South=180, West=270.
   * By default, a value of 0(North) is used.
   *
   * @param v - The azimuth angle in degrees to use.
   * @returns The current QueryBuilder instance.
   */
  azimuth(v: number): this {
    this.params.set('azimuth', v.toString())
    return this
  }
}
