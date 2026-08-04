/**
 * Custom error class for handling weather-related errors.
 *
 * @extends Error
 */
export class WeatherError extends Error {
  /**
   * Creates a new WeatherError instance.
   *
   * @param message - The error message.
   * @param options - Optional parameters for the error, including a cause.
   */
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'WeatherError'
  }
}

/**
 * Custom error class for handling weather API-related errors.
 *
 * @extends WeatherError
 */
export class WeatherAPIError extends WeatherError {
  readonly statusCode: number
  readonly reason: string

  /**
   * Creates a new WeatherAPIError instance.
   *
   * @param statusCode - The HTTP status code returned by the API.
   * @param reason - The reason or message associated with the error.
   * @param options - Optional parameters for the error, including a cause.
   */
  constructor(statusCode: number, reason: string, options?: { cause?: unknown }) {
    super(`API Error ${statusCode}: ${reason}`, options)
    this.name = 'WeatherAPIError'
    this.statusCode = statusCode
    this.reason = reason
  }
}

/**
 * Custom error class for handling network-related errors when fetching weather data.
 *
 * @extends WeatherError
 */
export class WeatherNetworkError extends WeatherError {
  /**
   * Creates a new WeatherNetworkError instance.
   *
   * @param message - The error message.
   * @param options - Optional parameters for the error, including a cause.
   */
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'WeatherNetworkError'
  }
}

/**
 * Custom error class for handling validation errors related to weather data.
 *
 * @extends WeatherError
 */
export class WeatherValidationError extends WeatherError {
  /**
   * Creates a new WeatherValidationError instance.
   *
   * @param message - The error message.
   * @param options - Optional parameters for the error, including a cause.
   */
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'WeatherValidationError'
  }
}

/**
 * Custom error class for handling errors related to mapping weather data.
 *
 * @extends WeatherError
 */
export class WeatherMappingError extends WeatherError {
  /**
   * Creates a new WeatherMappingError instance.
   *
   * @param message - The error message.
   * @param options - Optional parameters for the error, including a cause.
   */
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'WeatherMappingError'
  }
}
