import { RawWeatherResponse, WeatherResponse } from './types/response.js'
import { WeatherAnalyzer } from './types/analyzer.js'
import { HttpClient } from './http/fetch-client.js'
import { mapWeatherResponse } from './mapper/weather-mapper.js'

/**
 * Orchestrates weather data retrieval by wiring together the HttpClient,
 * WeatherMapper, and optional WeatherAnalyzer plugins.
 *
 * This is the primary entry point for consumers of the SDK.
 */
export class WeatherClient {
  private readonly http: HttpClient
  private readonly analyzers: WeatherAnalyzer[]

  /**
   * Creates a WeatherClient with an injected HttpClient and optional analyzers.
   *
   * @param http - The HTTP client used to make API requests.
   * @param analyzers - Analyzer plugins applied to the mapped response, in order.
   */
  constructor(http: HttpClient, analyzers: WeatherAnalyzer[] = []) {
    this.http = http
    this.analyzers = analyzers
  }

  /**
   * Convenience factory that creates a WeatherClient with default settings.
   *
   * @returns A WeatherClient backed by a default HttpClient.
   */
  static create(): WeatherClient {
    return new WeatherClient(new HttpClient())
  }

  /**
   * Fetches forecast data, maps it to the normalized shape, and applies any registered analyzers sequentially.
   *
   * @param query - The built query parameters (e.g. from QueryBuilder.build()).
   * @returns The normalized weather response, enriched by analyzers if any.
   * @throws {WeatherAPIError} If the API returns an error status.
   * @throws {WeatherNetworkError} If the network request fails or times out.
   * @throws {WeatherMappingError} If the raw response cannot be mapped.
   */
  async fetchWeather(query: Record<string, string>): Promise<WeatherResponse> {
    const rawResponse = await this.http.get<RawWeatherResponse>('/forecast', query)
    let data: WeatherResponse = mapWeatherResponse(rawResponse)

    for (const analyzer of this.analyzers) {
      data = analyzer.analyze(data) as WeatherResponse
    }

    return data
  }
}
