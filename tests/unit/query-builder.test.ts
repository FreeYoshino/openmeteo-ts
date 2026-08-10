import { describe, it, expect } from 'vitest'
import { QueryBuilder } from '../../src/builder/query-builder.js'

describe('QueryBuilder', () => {
  describe('Constructor', () => {
    it('should start with no parameters', () => {
      const builder = new QueryBuilder()
      const result = builder.latitude(40.7128).longitude(-74.006).build()
      expect(Object.keys(result)).toEqual(['latitude', 'longitude'])
    })
  })

  describe('setters', () => {
    describe('required parameters', () => {
      it('should set single latitude value', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(40.7128).longitude(0).build()
        expect(result.latitude).toBe('40.7128')
      })

      it('should join multiple latitude values with a comma', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude([40.7128, 34.0522]).longitude(0).build()
        expect(result.latitude).toBe('40.7128,34.0522')
      })

      it('should set single longitude value', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(-74.006).build()
        expect(result.longitude).toBe('-74.006')
      })

      it('should join multiple longitude values with a comma', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude([-74.006, -118.2437]).build()
        expect(result.longitude).toBe('-74.006,-118.2437')
      })
    })

    describe('weather variable parameters', () => {
      it('should join multiple hourly weather variables with a comma', () => {
        const builder = new QueryBuilder()
        const result = builder
          .latitude(0)
          .longitude(0)
          .hourly(['temperature_2m', 'relative_humidity_2m'])
          .build()
        expect(result.hourly).toBe('temperature_2m,relative_humidity_2m')
      })

      it('should join multiple daily weather variables with a comma', () => {
        const builder = new QueryBuilder()
        const result = builder
          .latitude(0)
          .longitude(0)
          .daily(['temperature_2m_max', 'temperature_2m_min'])
          .build()
        expect(result.daily).toBe('temperature_2m_max,temperature_2m_min')
      })

      it('should join multiple current weather variables with a comma', () => {
        const builder = new QueryBuilder()
        const result = builder
          .latitude(0)
          .longitude(0)
          .current(['apparent_temperature', 'cloud_cover'])
          .build()
        expect(result.current).toBe('apparent_temperature,cloud_cover')
      })

      it('should join multiple minutely15 weather variables with a comma', () => {
        const builder = new QueryBuilder()
        const result = builder
          .latitude(0)
          .longitude(0)
          .minutely15(['precipitation', 'cape'])
          .build()
        expect(result.minutely_15).toBe('precipitation,cape')
      })
    })

    describe('unit parameters', () => {
      it('should set temperature unit', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).temperatureUnit('fahrenheit').build()
        expect(result.temperature_unit).toBe('fahrenheit')
      })

      it('should set wind speed unit', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).windSpeedUnit('mph').build()
        expect(result.wind_speed_unit).toBe('mph')
      })

      it('should set precipitation unit', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).precipitationUnit('inch').build()
        expect(result.precipitation_unit).toBe('inch')
      })
    })
  })
})
