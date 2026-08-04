import { describe, it, expect, afterEach, vi } from 'vitest'
import { HttpClient } from '../../src/http/fetch-client.js'
import { WeatherAPIError, WeatherNetworkError } from '../../src/http/errors.js'

describe('HttpClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('get()', () => {
    it('should return parsed JSON on successful request', async () => {
      const mockData = { latitude: 40.7128, longitude: -74.006 }

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockData),
        }),
      )

      const client = new HttpClient()
      const result = await client.get<typeof mockData>('/forecast')

      expect(result).toEqual(mockData)
    })

    it('should throw WeatherAPIError with body.reason when response has error body', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          json: () => Promise.resolve({ error: true, reason: 'Parameter "latitude" is required' }),
        }),
      )

      const client = new HttpClient()

      await expect(client.get('/forecast')).rejects.toThrow(WeatherAPIError)
      await expect(client.get('/forecast')).rejects.toMatchObject({
        statusCode: 400,
        reason: 'Parameter "latitude" is required',
        message: 'API Error 400: Parameter "latitude" is required',
      })
    })

    it('should use statusText when error body is not valid JSON', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.reject(new Error('Unexpected token')),
        }),
      )

      const client = new HttpClient()

      await expect(client.get('/forecast')).rejects.toThrow(WeatherAPIError)
      await expect(client.get('/forecast')).rejects.toMatchObject({
        statusCode: 500,
        reason: 'Internal Server Error',
      })
    })

    it('should throw WeatherNetworkError on network failure', async () => {
      const causeError = new TypeError('fetch failed')
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(causeError))

      const client = new HttpClient()

      await expect(client.get('/forecast')).rejects.toThrow(WeatherNetworkError)
      await expect(client.get('/forecast')).rejects.toMatchObject({
        message: 'Network request failed',
        cause: causeError,
      })
    })

    it('should throw WeatherNetworkError on timeout', async () => {
      const causeError = new DOMException('The operation was aborted.', 'TimeoutError')
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(causeError))

      const client = new HttpClient()

      await expect(client.get('/forecast')).rejects.toThrow(WeatherNetworkError)
      await expect(client.get('/forecast')).rejects.toMatchObject({
        message: 'Request timed out after 10000 ms',
        cause: causeError,
      })
    })
  })

  describe('constructor', () => {
    it('should use default baseUrl when not provided', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })
      vi.stubGlobal('fetch', fetchMock)

      const client = new HttpClient()
      await client.get('/forecast')

      const calledUrl = fetchMock.mock.calls[0][0]
      expect(calledUrl).toBe('https://api.open-meteo.com/v1/forecast')
    })

    it('should use provided baseUrl', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })
      vi.stubGlobal('fetch', fetchMock)

      const client = new HttpClient('https://custom-api.com/')
      await client.get('/forecast')

      const calledUrl = fetchMock.mock.calls[0][0]
      expect(calledUrl).toBe('https://custom-api.com/forecast')
    })

    it('should append query parameters correctly', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })
      vi.stubGlobal('fetch', fetchMock)

      const client = new HttpClient()
      await client.get('/forecast', { latitude: '40.7128', longitude: '-74.006' })

      const calledUrl = fetchMock.mock.calls[0][0]
      expect(calledUrl).toContain('https://api.open-meteo.com/v1/forecast?')
      expect(calledUrl).toContain('latitude=40.7128')
      expect(calledUrl).toContain('longitude=-74.006')
    })

    it('should not append query parameters when none are provided', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })
      vi.stubGlobal('fetch', fetchMock)

      const client = new HttpClient()
      await client.get('/forecast')

      const calledUrl = fetchMock.mock.calls[0][0]
      expect(calledUrl).toBe('https://api.open-meteo.com/v1/forecast')
      expect(calledUrl).not.toContain('?')
    })
  })
})
