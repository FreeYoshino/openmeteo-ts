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
})
