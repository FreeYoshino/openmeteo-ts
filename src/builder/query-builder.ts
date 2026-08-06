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
   * Must be between -90 and 90(validted at build time).
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
   * Must be between -180 and 180(validted at build time).
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
   * this parameter allows you to correctly match weather data to specific mountain peaksor actual site altitudes.
   *
   * @param v - Elevation in meters above sea level.
   *    - `number`: Elevation for a single location.
   *    - `number[]`: Elevations for multiple locations.
   *    - `'nan'`: Disables downscaling and uses the average grid-cell height from the model.
   * @returns The current QueryBuilder instance.
   */
  elevations(v: number | number[] | 'nan'): this {
    this.params.set('elevation', Array.isArray(v) ? v.join(',') : v.toString())
    return this
  }
}
