import { WeatherAPIError, WeatherNetworkError } from './errors.js'

/**
 * A simple HTTP client for making requests.
 */
export class HttpClient {
  private readonly baseUrl: string
  private readonly defaultTimeoutMs: number

  /**
   * Sets the base URL and default timeout for the HTTP client.
   *
   * @param baseUrl - The base URL for the HTTP client. Defaults to 'https://api.open-meteo.com/v1'.
   * @param defaultTimeoutMs - The default timeout in milliseconds for requests. Defaults to 10000 ms.
   */
  constructor(baseUrl?: string, defaultTimeoutMs?: number) {
    this.baseUrl = baseUrl || 'https://api.open-meteo.com/v1/'
    this.defaultTimeoutMs = defaultTimeoutMs || 10000
  }

  /**
   * Makes a GET request to the specified path with optional query parameters.
   *
   * @param path - The path to append to the base URL for the GET request.
   * @param params - Optional query parameters to include in the GET request.
   *
   * @returns A promise that resolves to the parsed JSON response body of type T.
   * @throws {WeatherNetworkError} If the network request fails or times out.
   * @throws {WeatherAPIError} If the response status is not in the range 200-299.
   */
  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    // ensure the baseUrl ends with a slash and the path does not start with a slash to avoid double slashes in the URL
    const normalizedBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path

    const url = new URL(normalizedPath, normalizedBaseUrl)
    if (params) {
      url.search = new URLSearchParams(params).toString()
    }

    let response: Response
    try {
      response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(this.defaultTimeoutMs),
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new WeatherNetworkError(`Request timed out after ${this.defaultTimeoutMs} ms`, {
          cause: error,
        })
      }

      throw new WeatherNetworkError('Network request failed', { cause: error })
    }

    if (!response.ok) {
      let reason = response.statusText
      try {
        const body = await response.json()
        if (body?.error && typeof body.reason === 'string') {
          reason = body.reason
        }
      } catch {
        // Ignore JSON parsing errors and use the text response as the reason
      }

      throw new WeatherAPIError(response.status, reason)
    }

    return (await response.json()) as T
  }
}
