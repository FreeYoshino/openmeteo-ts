import { describe, it, expect } from 'vitest'
import { mapWeatherResponse } from '../../src/mapper/weather-mapper.js'
import { RawWeatherResponse } from '../../src/types/response.js'
import { WeatherMappingError } from '../../src/http/errors.js'

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

      expect(result.hourly?.[0]?.time).toEqual(new Date('2026-08-12T12:00:00Z'))
    })

    it('should convert unix timestamp to Date object', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        hourly: {
          time: [1786536000], // Unix timestamp for 2026-08-12T12:00:00Z
          temperature_2m: [25],
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.hourly?.[0]?.time).toEqual(new Date('2026-08-12T12:00:00Z'))
    })
  })

  describe('empty optional blocks', () => {
    it('should leave hourly, daily, current, and minutely_15 as undefined when they are not present in the raw response', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse()

      const result = mapWeatherResponse(rawResponse)

      expect(result.hourly).toBeUndefined()
      expect(result.daily).toBeUndefined()
      expect(result.current).toBeUndefined()
      expect(result.minutely_15).toBeUndefined()
    })
  })

  describe('hourly mapping', () => {
    it('should map parallel array to object array for hourly data', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        hourly: {
          time: ['2026-08-12T12:00:00Z', '2026-08-12T13:00:00Z'],
          temperature_2m: [25, 26],
          albedo: [50, 55],
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.hourly).toHaveLength(2)
      expect(result.hourly?.[0]).toMatchObject({
        temperature_2m: 25,
        albedo: 50,
      })
      expect(result.hourly?.[1]).toMatchObject({
        temperature_2m: 26,
        albedo: 55,
      })
    })

    it('should pass through hourly_units unchanged', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        hourly_units: {
          temperature_2m: '°C',
          humidity_2m: '%',
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.hourly_units).toEqual({
        temperature_2m: '°C',
        humidity_2m: '%',
      })
    })
  })

  describe('daily mapping', () => {
    it('should map parallel array to object array for daily data', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        daily: {
          time: ['2026-08-12T12:00:00Z', '2026-08-12T13:00:00Z'],
          apparent_temperature_max: [25, 26],
          apparent_temperature_min: [50, 55],
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.daily).toHaveLength(2)
      expect(result.daily?.[0]).toMatchObject({
        apparent_temperature_max: 25,
        apparent_temperature_min: 50,
      })
      expect(result.daily?.[1]).toMatchObject({
        apparent_temperature_max: 26,
        apparent_temperature_min: 55,
      })
    })

    it('should pass through daily_units unchanged', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        daily_units: {
          temperature_2m: '°C',
          humidity_2m: '%',
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.daily_units).toEqual({
        temperature_2m: '°C',
        humidity_2m: '%',
      })
    })
  })

  describe('minutely_15 mapping', () => {
    it('should map parallel array to object array for minutely_15 data', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        minutely_15: {
          time: ['2026-08-12T12:00:00Z', '2026-08-12T13:00:00Z'],
          temperature_2m: [25, 26],
          apparent_temperature: [50, 55],
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.minutely_15).toHaveLength(2)
      expect(result.minutely_15?.[0]).toMatchObject({
        temperature_2m: 25,
        apparent_temperature: 50,
      })
      expect(result.minutely_15?.[1]).toMatchObject({
        temperature_2m: 26,
        apparent_temperature: 55,
      })
    })

    it('should pass through minutely_15_units unchanged', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        minutely_15_units: {
          temperature_2m: '°C',
          humidity_2m: '%',
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.minutely_15_units).toEqual({
        temperature_2m: '°C',
        humidity_2m: '%',
      })
    })
  })

  describe('current mapping', () => {
    it('should map current weather data correctly', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        current: {
          time: '2026-08-12T12:00:00Z',
          interval: 0,
          temperature_2m: 25,
          apparent_temperature: 50,
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.current).toMatchObject({
        time: new Date('2026-08-12T12:00:00Z'),
        interval: 0,
        temperature_2m: 25,
        apparent_temperature: 50,
      })
    })

    it('should convert unix timestamp to Date object for current data', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        current: {
          time: 1786536000, // Unix timestamp for 2026-08-12T12:00:00Z
          interval: 900,
          temperature_2m: 25,
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.current).toMatchObject({
        time: new Date('2026-08-12T12:00:00Z'),
        interval: 900,
        temperature_2m: 25,
      })
    })

    it('should pass through current_units unchanged', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        current_units: {
          temperature_2m: '°C',
          humidity_2m: '%',
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.current_units).toEqual({
        temperature_2m: '°C',
        humidity_2m: '%',
      })
    })
  })

  describe('array length mismatch handling', () => {
    it('should throw WeatherMappingError when variable array lengths do not match', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        hourly: {
          time: ['2026-08-12T12:00:00Z', '2026-08-12T13:00:00Z'],
          temperature_2m: [25], // Mismatched length
        },
      })

      expect(() => mapWeatherResponse(rawResponse)).toThrow(WeatherMappingError)
    })
  })

  describe('multiple blocks mapping', () => {
    it('should map hourly and daily data correctly when both are present', () => {
      const rawResponse: RawWeatherResponse = makeRawWeatherResponse({
        hourly: {
          time: ['2026-08-12T12:00:00Z', '2026-08-12T13:00:00Z'],
          temperature_2m: [25, 26],
        },
        daily: {
          time: ['2026-08-12T12:00:00Z', '2026-08-13T12:00:00Z'],
          apparent_temperature_max: [25, 27],
        },
      })

      const result = mapWeatherResponse(rawResponse)

      expect(result.hourly).toHaveLength(2)
      expect(result.daily).toHaveLength(2)
    })
  })
})
