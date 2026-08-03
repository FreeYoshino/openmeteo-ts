import type { WeatherResponse } from './response.js'

/**
 * Weather Analyzer interface
 *
 * All business extension modules must implement this interface
 */
export interface WeatherAnalyzer<TExtension = Record<string, unknown>> {
  /** Analyzer identifier */
  readonly id: string

  /**
   * Analyzes the given weather data and return the analysis result.
   *
   * @param data - The weather data to analyze.
   * @returns - The analysis result extended with the optional extension data.
   */
  analyze(data: WeatherResponse): WeatherResponse & TExtension
}
