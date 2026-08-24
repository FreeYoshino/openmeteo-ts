import { describe, it, expect, afterEach, vi } from 'vitest'
import { WeatherClient } from '../../src/client.js'
import { QueryBuilder } from '../../src/builder/query-builder.js'
import { makeRawWeatherResponse } from '../helper.js'
import { createFleetRiskAnalyzer } from '../../src/analyzers/fleet-risk.js'
import { WeatherAnalyzer } from '../../src/types/analyzer.js'
import { WeatherResponse } from '../../src/types/response.js'

describe('FleetRiskAnalyzer integration tests', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('through the WeatherClient', () => {
    it('should enrich the respose with typed fleetRisk data', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve(
              makeRawWeatherResponse({
                hourly: {
                  time: ['2026-01-01T00:00:00Z'],
                  precipitation: [12],
                },
              }),
            ),
        }),
      )

      const client = WeatherClient.create().use(createFleetRiskAnalyzer())
      const query = new QueryBuilder().latitude(40).longitude(-74).hourly(['precipitation']).build()
      const result = await client.fetchWeather(query)

      expect(result.fleetRisk).toBeDefined()
      expect(result.fleetRisk?.[0]?.riskScore).toBe(3)
      expect(result.fleetRisk?.[0]?.riskFactors).toContain('Heavy Rain')
    })

    it('should align fleetRisk by index with hourly', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve(
              makeRawWeatherResponse({
                hourly: {
                  time: ['2026-01-01T00:00:00Z'],
                  precipitation: [12],
                },
              }),
            ),
        }),
      )

      const client = WeatherClient.create().use(createFleetRiskAnalyzer())
      const query = new QueryBuilder().latitude(40).longitude(-74).hourly(['precipitation']).build()
      const result = await client.fetchWeather(query)

      expect(result.fleetRisk?.length).toBe(1)
      expect(result.hourly?.length).toBe(1)
    })

    it('should return empty fleetRisk when hourly is absent', async () => {
      vi.stubGlobal(
        'fetch',
        vi
          .fn()
          .mockResolvedValue({ ok: true, json: () => Promise.resolve(makeRawWeatherResponse()) }),
      )

      const client = WeatherClient.create().use(createFleetRiskAnalyzer())
      const query = new QueryBuilder().latitude(40).longitude(-74).build()
      const result = await client.fetchWeather(query)

      expect(result.fleetRisk).toBeDefined()
      expect(result.fleetRisk).toEqual([])
    })

    it('should honor threshold overrides through the client', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve(
              makeRawWeatherResponse({
                hourly: {
                  time: ['2026-01-01T00:00:00Z'],
                  precipitation: [12],
                },
              }),
            ),
        }),
      )

      const analyzer = createFleetRiskAnalyzer({ heavyRain: 15 })
      const client = WeatherClient.create().use(analyzer)
      const query = new QueryBuilder().latitude(40).longitude(-74).hourly(['precipitation']).build()
      const result = await client.fetchWeather(query)

      // The default threshold for heavy rain is 10, but we overrode it to 15. Since the precipitation is 12, it should now be classified as moderate rain instead of heavy rain.
      expect(result.fleetRisk).toBeDefined()
      expect(result.fleetRisk?.[0]?.riskScore).toBe(1)
      expect(result.fleetRisk?.[0]?.riskFactors).toContain('Moderate Rain')
    })

    it('should compose with another analyzer', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve(
              makeRawWeatherResponse({
                hourly: {
                  time: ['2026-01-01T00:00:00Z'],
                  precipitation: [12],
                },
              }),
            ),
        }),
      )

      const secondAnalyze = vi.fn((data: WeatherResponse) => ({
        ...data,
        alerts: ['frost warning'],
      }))
      const secondAnalyzer: WeatherAnalyzer<{ alerts: string[] }> = {
        id: 'alerts-analyzer',
        analyze: secondAnalyze,
      }

      const client = WeatherClient.create().use(createFleetRiskAnalyzer()).use(secondAnalyzer)
      const query = new QueryBuilder().latitude(40).longitude(-74).hourly(['precipitation']).build()
      const result = await client.fetchWeather(query)

      expect(result.fleetRisk).toBeDefined()
      expect(result.fleetRisk?.[0]?.riskScore).toBe(3)
      expect(result.fleetRisk?.[0]?.riskFactors).toContain('Heavy Rain')

      expect(result.alerts).toBeDefined()
      expect(result.alerts).toEqual(['frost warning'])

      expect(secondAnalyze.mock.calls[0]?.[0]).toHaveProperty('fleetRisk')
    })
  })
})
