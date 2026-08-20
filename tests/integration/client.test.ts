import { describe, it, expect, afterEach, vi } from 'vitest'
import { WeatherClient } from '../../src/client.js'
import { HttpClient } from '../../src/http/fetch-client.js'
import { QueryBuilder } from '../../src/builder/query-builder.js'
import { makeRawWeatherResponse } from '../helper.js'

describe('WeatherClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })
  describe('pipeline', () => {
    it('should pass through metadata unchanged', async () => {
      const mockRawResponse = makeRawWeatherResponse({
        latitude: 40.7128,
        longitude: -74.006,
        elevation: 10,
        generationtime_ms: 10,
        utc_offset_seconds: -18000,
        timezone: 'America/New_York',
        timezone_abbreviation: 'EDT',
      })

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockRawResponse),
        }),
      )

      const client = new WeatherClient(new HttpClient())
      const query = new QueryBuilder().latitude(40.7128).longitude(-74.006).build()
      const result = await client.fetchWeather(query)

      expect(result.latitude).toBe(40.7128)
      expect(result.longitude).toBe(-74.006)
      expect(result.elevation).toBe(10)
      expect(result.generationtime_ms).toBe(10)
      expect(result.utc_offset_seconds).toBe(-18000)
      expect(result.timezone).toBe('America/New_York')
      expect(result.timezone_abbreviation).toBe('EDT')
    })

    it('should convert time strings to Date objects', async () => {
      const mockRawResponse = makeRawWeatherResponse({
        hourly: {
          time: ['2024-01-01T00:00', '2024-01-01T01:00'],
        },
      })

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockRawResponse),
        }),
      )

      const client = new WeatherClient(new HttpClient())
      const query = new QueryBuilder().latitude(0).longitude(0).build()
      const result = await client.fetchWeather(query)

      expect(result).toMatchObject({
        hourly: [{ time: new Date('2024-01-01T00:00') }, { time: new Date('2024-01-01T01:00') }],
      })
    })

    it('should map parallel arrays to array of objects', async () => {
      const mockRawResponse = makeRawWeatherResponse({
        hourly: {
          time: ['2024-01-01T00:00', '2024-01-01T01:00'],
          temperature_2m: [5, 6],
        },
      })

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockRawResponse),
        }),
      )

      const client = new WeatherClient(new HttpClient())
      const query = new QueryBuilder().latitude(0).longitude(0).hourly(['temperature_2m']).build()
      const result = await client.fetchWeather(query)

      expect(result).toMatchObject({
        hourly: [
          { time: new Date('2024-01-01T00:00'), temperature_2m: 5 },
          { time: new Date('2024-01-01T01:00'), temperature_2m: 6 },
        ],
      })
    })
  })
})
