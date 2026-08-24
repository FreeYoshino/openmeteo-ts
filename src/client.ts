import { RawWeatherResponse, WeatherResponse } from './types/response.js'
import { WeatherAnalyzer } from './types/analyzer.js'
import { HttpClient } from './http/fetch-client.js'
import { mapWeatherResponse } from './mapper/weather-mapper.js'

/**
 * Orchestrates weather data retrieval by wiring together the HttpClient,
 * WeatherMapper, and optional WeatherAnalyzer plugins.
 *
 * Analyzer extensions accumulate across the builder chain: every {@link use}
 * returns a NEW instance whose `TExtension` intersects the previous one, so the
 * return type of {@link fetchWeather} stays fully typed without casts.
 *
 * This is the primary entry point for consumers of the SDK.
 */
export class WeatherClient<TExtension = unknown> {
  private readonly http: HttpClient
  private readonly analyzers: WeatherAnalyzer<unknown>[]

  /** @internal Use {@link create} instead */
  private constructor(http: HttpClient, analyzers: WeatherAnalyzer<unknown>[] = []) {
    this.http = http
    this.analyzers = analyzers
  }

  /**
   * Creates a base WeatherClient with no analyzers.
   *
   * @param http - Optional custom HttpClient (defaults to a standard one).
   * @returns A WeatherClient backed by a default HttpClient.
   */
  static create(http: HttpClient = new HttpClient()): WeatherClient {
    return new WeatherClient(http)
  }

  /**
   * Returns a NEW WeatherClient with the given analyzer appended.
   *
   * This is immutable — the current instance is left untouched. The analyzer's extension type is intersected into `TExtension` for the returned client.
   * Analyzers should spread `data` so earlier analyzers' extensions survive.
   *
   * @param analyzer - The analyzer plugin to append.
   * @returns A new WeatherClient whose responses include `TExtension & TNewExtension`.
   */
  use<TNewExtension>(
    analyzer: WeatherAnalyzer<TNewExtension>,
  ): WeatherClient<TExtension & TNewExtension> {
    return new WeatherClient<TExtension & TNewExtension>(this.http, [...this.analyzers, analyzer])
  }

  /**
   * Fetches forecast data, maps it to the normalized shape, and applies any registered analyzers sequentially.
   *
   * @param query - The built query parameters (e.g. from QueryBuilder.build()).
   * @returns The normalized weather response, enriched by all analyzer extensions.
   * @throws {WeatherAPIError} If the API returns an error status.
   * @throws {WeatherNetworkError} If the network request fails or times out.
   * @throws {WeatherMappingError} If the raw response cannot be mapped.
   */
  async fetchWeather(query: Record<string, string>): Promise<WeatherResponse & TExtension> {
    const rawResponse = await this.http.get<RawWeatherResponse>('/forecast', query)
    let data: WeatherResponse = mapWeatherResponse(rawResponse)

    for (const analyzer of this.analyzers) {
      data = analyzer.analyze(data)
    }

    return data as WeatherResponse & TExtension
  }
}
