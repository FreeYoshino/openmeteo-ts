import { describe, it, expect } from 'vitest'
import { mapWeatherResponse } from '../../src/mapper/weather-mapper.js'
import { RawWeatherResponse } from '../../src/types/response.js'

function makeRawWeatherResponse(overrides: Partial<RawWeatherResponse> = {}): RawWeatherResponse {
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

describe('mapWeatherResponse', () => {
  describe('metadata passthrough', () => {
    it('should pass through latitude, longitude, and other metadata unchanged', () => {
      const rawResponse: RawWeatherResponse = {
        latitude: 40.7128,
        longitude: -74.006,
        elevation: 10,
        generationtime_ms: 123.45,
        utc_offset_seconds: -18000,
        timezone: 'America/New_York',
        timezone_abbreviation: 'EDT',
      }

      const result = mapWeatherResponse(rawResponse)

      expect(result.latitude).toBe(40.7128)
      expect(result.longitude).toBe(-74.006)
      expect(result.elevation).toBe(10)
      expect(result.generationtime_ms).toBe(123.45)
      expect(result.utc_offset_seconds).toBe(-18000)
      expect(result.timezone).toBe('America/New_York')
      expect(result.timezone_abbreviation).toBe('EDT')
    })
  })

  describe('time conversion', () => {
    it('should convert ISO 8601 time string to Date object', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        hourly: {
          time: ['2026-08-12T12:00:00Z'],
          temperature_2m: [25],
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.hourly![0].time).toEqual(new Date('2026-08-12T12:00:00Z'))
    })

    it('should convert unix timestamp to Date object', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        hourly: {
          time: [1786536000], // Unix timestamp for 2026-08-12T12:00:00Z
          temperature_2m: [25],
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.hourly![0].time).toEqual(new Date('2026-08-12T12:00:00Z'))
    })
  })
})
