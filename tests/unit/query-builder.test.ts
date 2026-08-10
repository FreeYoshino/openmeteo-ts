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

    describe('unit and enum parameters', () => {
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

      it('should set time format', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).timeFormat('unixtime').build()
        expect(result.timeformat).toBe('unixtime')
      })

      it('should set cell selection', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).cellSelection('nearest').build()
        expect(result.cell_selection).toBe('nearest')
      })
    })

    describe('numeric parameters', () => {
      it('should set past days', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).pastDays(5).build()
        expect(result.past_days).toBe('5')
      })

      it('should set past hours', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).pastHours(12).build()
        expect(result.past_hours).toBe('12')
      })

      it('should set forecast days', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).forecastDays(7).build()
        expect(result.forecast_days).toBe('7')
      })

      it('should set forecast hours', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).forecastHours(24).build()
        expect(result.forecast_hours).toBe('24')
      })

      it('should set tilt', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).tilt(30).build()
        expect(result.tilt).toBe('30')
      })

      it('should set azimuth', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).azimuth(180).build()
        expect(result.azimuth).toBe('180')
      })
    })

    describe('array-capable parameters', () => {
      it('should set single elevation value', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).elevation(100).build()
        expect(result.elevation).toBe('100')
      })

      it('should join multiple elevation values with a comma', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).elevation([100, 200]).build()
        expect(result.elevation).toBe('100,200')
      })

      it('should set elevation to "nan"', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).elevation('nan').build()
        expect(result.elevation).toBe('nan')
      })

      it('should set single model value', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).models('best_match').build()
        expect(result.models).toBe('best_match')
      })

      it('should join multiple model values with a comma', () => {
        const builder = new QueryBuilder()
        const result = builder
          .latitude(0)
          .longitude(0)
          .models(['best_match', 'cmc_gem_gdps'])
          .build()
        expect(result.models).toBe('best_match,cmc_gem_gdps')
      })
    })

    describe('string parameters', () => {
      it('should set timezone', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).timezone('America/New_York').build()
        expect(result.timezone).toBe('America/New_York')
      })

      it('should set timezone to "auto"', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).timezone('auto').build()
        expect(result.timezone).toBe('auto')
      })

      it('should set start date', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).startDate('2026-08-10').build()
        expect(result.start_date).toBe('2026-08-10')
      })

      it('should set end date', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).endDate('2026-08-10').build()
        expect(result.end_date).toBe('2026-08-10')
      })

      it('should set api key', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(0).longitude(0).apiKey('my-api-key').build()
        expect(result.apikey).toBe('my-api-key')
      })
    })
  })

  describe('fluent chaining', () => {
    it('should support method chaining', () => {
      const builder = new QueryBuilder()
      const result = builder.latitude(0)

      expect(result).toBe(builder)
    })

    it('should build a complete query with chained setters', () => {
      const builder = new QueryBuilder()
      const result = builder
        .latitude(40.7128)
        .longitude(-74.006)
        .hourly(['temperature_2m', 'relative_humidity_2m'])
        .daily(['temperature_2m_max', 'temperature_2m_min'])
        .current(['apparent_temperature', 'cloud_cover'])
        .minutely15(['precipitation', 'cape'])
        .temperatureUnit('fahrenheit')
        .windSpeedUnit('mph')
        .precipitationUnit('inch')
        .timeFormat('unixtime')
        .timezone('America/New_York')
        .pastDays(5)
        .pastHours(12)
        .forecastDays(7)
        .forecastHours(24)
        .startDate('2026-08-10')
        .endDate('2026-08-10')
        .tilt(30)
        .azimuth(180)
        .cellSelection('nearest')
        .apiKey('my-api-key')
        .models(['best_match', 'cmc_gem_gdps'])
        .build()

      expect(result).toEqual({
        latitude: '40.7128',
        longitude: '-74.006',
        hourly: 'temperature_2m,relative_humidity_2m',
        daily: 'temperature_2m_max,temperature_2m_min',
        current: 'apparent_temperature,cloud_cover',
        minutely_15: 'precipitation,cape',
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        precipitation_unit: 'inch',
        timeformat: 'unixtime',
        timezone: 'America/New_York',
        past_days: '5',
        past_hours: '12',
        forecast_days: '7',
        forecast_hours: '24',
        start_date: '2026-08-10',
        end_date: '2026-08-10',
        tilt: '30',
        azimuth: '180',
        cell_selection: 'nearest',
        apikey: 'my-api-key',
        models: 'best_match,cmc_gem_gdps',
      })
    })
  })

  describe('build() validation', () => {
    describe('required parameters', () => {
      it('should throw when latitude is not set', () => {
        const builder = new QueryBuilder()
        expect(() => builder.longitude(0).build()).toThrow('Missing required parameter: latitude')
      })

      it('should throw when longitude is not set', () => {
        const builder = new QueryBuilder()
        expect(() => builder.latitude(0).build()).toThrow('Missing required parameter: longitude')
      })
    })
  })
})
