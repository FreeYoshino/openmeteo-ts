import { RawWeatherResponse, WeatherResponse } from '../src/types/response.js'

export function makeRawWeatherResponse(
  overrides: Partial<RawWeatherResponse> = {},
): RawWeatherResponse {
  return {
    latitude: 0,
    longitude: 0,
    elevation: 0,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: '',
    timezone_abbreviation: '',
    ...overrides,
  }
}

export function makeWeatherResponse(overrides: Partial<WeatherResponse> = {}): WeatherResponse {
  return {
    latitude: 0,
    longitude: 0,
    elevation: 0,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: '',
    timezone_abbreviation: '',
    ...overrides,
  }
}
