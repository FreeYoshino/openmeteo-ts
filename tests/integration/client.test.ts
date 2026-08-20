import { describe, it, expect, afterEach, vi } from 'vitest'
import { WeatherClient } from '../../src/client.js'
import { HttpClient } from '../../src/http/fetch-client.js'
import { QueryBuilder } from '../../src/builder/query-builder.js'
import { makeRawWeatherResponse } from '../helper.js'
import { WeatherNetworkError, WeatherAPIError, WeatherMappingError } from '../../src/http/errors.js'
import { WeatherAnalyzer } from '../../src/types/analyzer.js'
import { WeatherResponse } from '../../src/types/response.js'

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

  describe('query params forwarded to fetch URL', () => {
    it('should forward query parameters', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve(makeRawWeatherResponse({ latitude: 40.7128, longitude: -74.006 })),
      })
      vi.stubGlobal('fetch', fetchMock)

      const client = new WeatherClient(new HttpClient())
      const query = new QueryBuilder().latitude(40.7128).longitude(-74.006).build()
      await client.fetchWeather(query)

      const calledUrl = fetchMock.mock.calls[0]![0]
      expect(calledUrl).toContain('latitude=40.7128')
      expect(calledUrl).toContain('longitude=-74.006')
    })

    it('should forward optional query parameters too', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve(makeRawWeatherResponse({ latitude: 40.7128, longitude: -74.006 })),
      })
      vi.stubGlobal('fetch', fetchMock)

      const client = new WeatherClient(new HttpClient())
      const query = new QueryBuilder()
        .latitude(40.7128)
        .longitude(-74.006)
        .elevation(10)
        .hourly(['temperature_2m'])
        .build()
      await client.fetchWeather(query)

      const calledUrl = fetchMock.mock.calls[0]![0]
      expect(calledUrl).toContain('latitude=40.7128')
      expect(calledUrl).toContain('longitude=-74.006')
      expect(calledUrl).toContain('elevation=10')
      expect(calledUrl).toContain('hourly=temperature_2m')
    })
  })

  describe('error propagation', () => {
    it('should propagate WeatherNetworkError when fetch fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')))

      const client = new WeatherClient(new HttpClient())
      const query = new QueryBuilder().latitude(0).longitude(0).build()

      await expect(client.fetchWeather(query)).rejects.toThrow(WeatherNetworkError)
    })

    it('should propagate WeatherAPIError when API returns error status', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          json: () => Promise.resolve({ error: true, reason: 'Parameter "latitude" is required' }),
        }),
      )

      const client = new WeatherClient(new HttpClient())
      const query = new QueryBuilder().latitude(0).longitude(0).build()

      await expect(client.fetchWeather(query)).rejects.toThrow(WeatherAPIError)
      await expect(client.fetchWeather(query)).rejects.toMatchObject({
        statusCode: 400,
        reason: 'Parameter "latitude" is required',
      })
    })

    it('should propagate WeatherMappingError when mapping fails', async () => {
      const mockRawResponse = makeRawWeatherResponse({
        hourly: {
          time: ['2024-01-01T00:00', '2024-01-01T01:00'],
          temperature_2m: [5], // Mismatched array length to trigger mapping error
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

      await expect(client.fetchWeather(query)).rejects.toThrow(WeatherMappingError)
    })
  })

  describe('analyzer execution', () => {
    it('should return mapped data when no analyzers are provided', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve(makeRawWeatherResponse({ latitude: 40.7128, longitude: -74.006 })),
        }),
      )

      const client = WeatherClient.create()
      const query = new QueryBuilder().latitude(40.7128).longitude(-74.006).build()
      const result = await client.fetchWeather(query)

      expect(result).toMatchObject({
        latitude: 40.7128,
        longitude: -74.006,
      })
    })

    it('should pass mapped data to analyzer', async () => {
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

      const analyze = vi.fn(
        (data: WeatherResponse) => data as WeatherResponse & Record<string, unknown>,
      )
      const analyzer: WeatherAnalyzer = { id: 'test-analyzer', analyze }
      const client = new WeatherClient(new HttpClient(), [analyzer])

      await client.fetchWeather(new QueryBuilder().latitude(0).longitude(0).build())

      expect(analyze).toHaveBeenCalledTimes(1)

      // Check that the analyzer received the mapped data, not the raw response
      const received = analyze.mock.calls[0]![0]
      expect(received).toMatchObject({
        hourly: [{ time: new Date('2024-01-01T00:00') }, { time: new Date('2024-01-01T01:00') }],
      })
    })

    it('should return the analyzer-modified data', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(makeRawWeatherResponse({ latitude: 0, longitude: 0 })),
        }),
      )

      const analyze = vi.fn((data: WeatherResponse) => {
        return { ...data, riskLevel: 'HIGH' }
      })
      const analyzer: WeatherAnalyzer<{ riskLevel: string }> = { id: 'risk-analyzer', analyze }
      const client = new WeatherClient(new HttpClient(), [analyzer])
      const query = new QueryBuilder().latitude(0).longitude(0).build()

      const result = (await client.fetchWeather(query)) as WeatherResponse & { riskLevel: string }

      expect(result.riskLevel).toBe('HIGH')
    })

    it('should apply multiple analyzers in order', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(makeRawWeatherResponse({ latitude: 0, longitude: 0 })),
        }),
      )

      const order: string[] = []
      const firstAnalyze = vi.fn((data: WeatherResponse) => {
        order.push('first')
        return { ...data, first: true }
      })
      const secondAnalyze = vi.fn((data: WeatherResponse) => {
        order.push('second')
        return data as WeatherResponse & Record<string, unknown>
      })

      const firstAnalyzer: WeatherAnalyzer<{ first: boolean }> = {
        id: 'first',
        analyze: firstAnalyze,
      }
      const secondAnalyzer: WeatherAnalyzer<Record<string, unknown>> = {
        id: 'second',
        analyze: secondAnalyze,
      }

      const client = new WeatherClient(new HttpClient(), [firstAnalyzer, secondAnalyzer])
      const query = new QueryBuilder().latitude(0).longitude(0).build()

      await client.fetchWeather(query)

      expect(order).toEqual(['first', 'second']) // Check that analyzers were called in the correct order
      expect(secondAnalyze.mock.calls[0]![0]).toHaveProperty('first', true) // Check that the second analyzer received the modified data from the first
    })
  })
})
