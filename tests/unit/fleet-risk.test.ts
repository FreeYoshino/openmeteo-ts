import { describe, it, expect } from 'vitest'
import { makeWeatherResponse } from '../helper.js'
import { createFleetRiskAnalyzer } from '../../src/analyzers/fleet-risk.js'

describe('createFleetRiskAnalyzer', () => {
  describe('id', () => {
    it('should return the correct analyzer id', () => {
      const analyzer = createFleetRiskAnalyzer()

      expect(analyzer.id).toBe('fleet-risk-analyzer')
    })
  })

  describe('analyze without hourly data', () => {
    it('should return the original data with an empty fleetRisk array', () => {
      const analyzer = createFleetRiskAnalyzer()
      const data = makeWeatherResponse({ hourly: undefined })
      const result = analyzer.analyze(data)

      expect(result.fleetRisk).toEqual([])
    })
  })

  describe('risk factor scoring', () => {
    describe('precipitation', () => {
      it('should score heavy rain correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), precipitation: 11 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(3)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Heavy Rain')
      })

      it('should score moderate rain correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), precipitation: 5 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(1)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Moderate Rain')
      })

      it('should score as moderate rain at heavy rain threshold', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), precipitation: 10 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(1)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Moderate Rain')
      })

      it('should score as moderate rain at lower boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), precipitation: 2 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(1)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Moderate Rain')
      })

      it('should score zero just below moderate rain threshold', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), precipitation: 1.9 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })
    })
    describe('wind speed', () => {
      it('should score strong wind correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), wind_speed_10m: 51 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(3)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Strong Wind')
      })

      it('should score moderate wind correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), wind_speed_10m: 40 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(1)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Moderate Wind')
      })

      it('should score as moderate wind at strong wind threshold', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), wind_speed_10m: 50 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(1)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Moderate Wind')
      })

      it('should score moderate wind at lower boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), wind_speed_10m: 30 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(1)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Moderate Wind')
      })

      it('should not score wind below lower boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), wind_speed_10m: 29.9 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })
    })

    describe('temperature', () => {
      it('should score heat correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), temperature_2m: 36 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(2)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Heat')
      })

      it('should score freezing correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), temperature_2m: -1 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(2)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Freezing')
      })

      it('should not score heat at threshold', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), temperature_2m: 35 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })

      it('should not score freezing at threshold', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), temperature_2m: 0 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })

      it('should not score between thresholds', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), temperature_2m: 20 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })
    })

    describe('snowfall', () => {
      it('should score heavy snow correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), snowfall: 6 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(3)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Heavy Snow')
      })

      it('should not score heavy snow at boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), snowfall: 5 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })

      it('should not score heavy snow below boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), snowfall: 4.9 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })
    })

    describe('visibility', () => {
      it('should score low visibility correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), visibility: 999 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(2)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Low Visibility')
      })

      it('should not score low visibility at boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), visibility: 1000 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })

      it('should not score low visibility above boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), visibility: 1500 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })
    })

    describe('weather_code', () => {
      it('should score thunderstorm correctly', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), weather_code: 96 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(4)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Thunderstorm')
      })

      it('should score thunderstorm at lower boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), weather_code: 95 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(4)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Thunderstorm')
      })

      it('should score thunderstorm at upper boundary', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), weather_code: 99 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(4)
        expect(result.fleetRisk[0]?.riskFactors).toContain('Thunderstorm')
      })

      it('should not score thunderstorm below range', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), weather_code: 94 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })

      it('should not score thunderstorm above range', () => {
        const analyzer = createFleetRiskAnalyzer()
        const data = makeWeatherResponse({
          hourly: [{ time: new Date('2026-01-01T00:00:00Z'), weather_code: 100 }],
        })
        const result = analyzer.analyze(data)

        expect(result.fleetRisk[0]?.riskScore).toBe(0)
        expect(result.fleetRisk[0]?.riskFactors).toEqual([])
      })
    })
  })

  describe('risk level mapping', () => {
    it('should map score 1 to low risk', () => {
      const analyzer = createFleetRiskAnalyzer()
      const data = makeWeatherResponse({
        hourly: [{ time: new Date('2026-01-01T00:00:00Z'), precipitation: 5 }],
      })
      const result = analyzer.analyze(data)

      expect(result.fleetRisk[0]?.riskScore).toBe(1)
      expect(result.fleetRisk[0]?.riskLevel).toBe('LOW')
    })

    it('should map score 2 to medium risk', () => {
      const analyzer = createFleetRiskAnalyzer()
      const data = makeWeatherResponse({
        hourly: [{ time: new Date('2026-01-01T00:00:00Z'), temperature_2m: 36 }],
      })
      const result = analyzer.analyze(data)

      expect(result.fleetRisk[0]?.riskScore).toBe(2)
      expect(result.fleetRisk[0]?.riskLevel).toBe('MEDIUM')
    })

    it('should map score 4 to medium risk', () => {
      const analyzer = createFleetRiskAnalyzer()
      const data = makeWeatherResponse({
        hourly: [{ time: new Date('2026-01-01T00:00:00Z'), weather_code: 96 }],
      })
      const result = analyzer.analyze(data)

      expect(result.fleetRisk[0]?.riskScore).toBe(4)
      expect(result.fleetRisk[0]?.riskLevel).toBe('MEDIUM')
    })

    it('should map score 5 to high risk', () => {
      const analyzer = createFleetRiskAnalyzer()
      const data = makeWeatherResponse({
        hourly: [{ time: new Date('2026-01-01T00:00:00Z'), weather_code: 96, precipitation: 5 }],
      })
      const result = analyzer.analyze(data)

      expect(result.fleetRisk[0]?.riskScore).toBe(5)
      expect(result.fleetRisk[0]?.riskLevel).toBe('HIGH')
    })
  })
})
