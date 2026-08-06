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
}
