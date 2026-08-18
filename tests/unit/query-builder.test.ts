import { describe, it, expect } from 'vitest'
import { QueryBuilder } from '../../src/builder/query-builder.js'
import { WeatherValidationError } from '../../src/http/errors.js'

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
        expect(() => builder.longitude(0).build()).toThrow(WeatherValidationError)
      })

      it('should throw when longitude is not set', () => {
        const builder = new QueryBuilder()
        expect(() => builder.latitude(0).build()).toThrow(WeatherValidationError)
      })
    })

    describe('range validation', () => {
      describe('latitude and longitude range validation', () => {
        it('should throw when latitude is out of range(>90)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(91).longitude(0).build()).toThrow(WeatherValidationError)
        })

        it('should throw when latitude is out of range(<-90)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(-91).longitude(0).build()).toThrow(WeatherValidationError)
        })

        it('should not throw when latitude is at the upper boundary(90)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(90).longitude(0).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when latitude is at the lower boundary(-90)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(-90).longitude(0).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when longitude is out of range(>180)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(181).build()).toThrow(WeatherValidationError)
        })

        it('should throw when longitude is out of range(<-180)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(-181).build()).toThrow(WeatherValidationError)
        })

        it('should not throw when longitude is at the upper boundary(180)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(180).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when longitude is at the lower boundary(-180)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(-180).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when a value in the latitude array is out of range(>90)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude([0, 91]).longitude(0).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when a value in the latitude array is out of range(<-90)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude([0, -91]).longitude(0).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when a value in the longitude array is out of range(>180)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude([0, 181]).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when a value in the longitude array is out of range(<-180)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude([0, -181]).build()).toThrow(
            WeatherValidationError,
          )
        })
      })

      describe('pastDays, pastHours, forecastDays, forecastHours range validation', () => {
        it('should throw when pastDays is out of range(>92)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).pastDays(93).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when pastDays is out of range(<0)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).pastDays(-1).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when pastDays is at the upper boundary(92)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).pastDays(92).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when pastDays is at the lower boundary(0)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).pastDays(0).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when pastHours is out of range(<1)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).pastHours(0).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when pastHours is at the lower boundary(1)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).pastHours(1).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when forecastDays is out of range(>16)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).forecastDays(17).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when forecastDays is out of range(<0)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).forecastDays(-1).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when forecastDays is at the upper boundary(16)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).forecastDays(16).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when forecastDays is at the lower boundary(0)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).forecastDays(0).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when forecastHours is out of range(<1)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).forecastHours(0).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when forecastHours is at the lower boundary(1)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).forecastHours(1).build()).not.toThrow(
            WeatherValidationError,
          )
        })
      })

      describe('tilt', () => {
        it('should throw when tilt is out of range(<0)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).tilt(-1).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when tilt is out of range(>90)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).tilt(91).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when tilt is at the lower boundary(0)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).tilt(0).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when tilt is at the upper boundary(90)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).tilt(90).build()).not.toThrow(
            WeatherValidationError,
          )
        })
      })

      describe('azimuth', () => {
        it('should throw when azimuth is out of range(<0)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).azimuth(-1).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should throw when azimuth is out of range(>360)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).azimuth(361).build()).toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when azimuth is at the lower boundary(0)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).azimuth(0).build()).not.toThrow(
            WeatherValidationError,
          )
        })

        it('should not throw when azimuth is at the upper boundary(360)', () => {
          const builder = new QueryBuilder()
          expect(() => builder.latitude(0).longitude(0).azimuth(360).build()).not.toThrow(
            WeatherValidationError,
          )
        })
      })
    })

    describe('date format validation', () => {
      it('should throw when startDate is not in YYYY-MM-DD format', () => {
        const builder = new QueryBuilder()
        expect(() => builder.latitude(0).longitude(0).startDate('08-10-2026').build()).toThrow(
          WeatherValidationError,
        )
      })

      it('should not throw when startDate is in YYYY-MM-DD format', () => {
        const builder = new QueryBuilder()
        expect(() => builder.latitude(0).longitude(0).startDate('2026-08-10').build()).not.toThrow(
          WeatherValidationError,
        )
      })

      it('should throw when endDate is not in YYYY-MM-DD format', () => {
        const builder = new QueryBuilder()
        expect(() => builder.latitude(0).longitude(0).endDate('08-10-2026').build()).toThrow(
          WeatherValidationError,
        )
      })

      it('should not throw when endDate is in YYYY-MM-DD format', () => {
        const builder = new QueryBuilder()
        expect(() => builder.latitude(0).longitude(0).endDate('2026-08-10').build()).not.toThrow(
          WeatherValidationError,
        )
      })
    })

    describe('Data type validation', () => {
      describe('Integer validation', () => {
        describe('pastDays', () => {
          it('should throw when pastDays is not an integer', () => {
            const builder = new QueryBuilder()
            expect(() => builder.latitude(0).longitude(0).pastDays(1.5).build()).toThrow(
              WeatherValidationError,
            )
          })

          it('should not throw when pastDays is an integer', () => {
            const builder = new QueryBuilder()
            expect(() => builder.latitude(0).longitude(0).pastDays(1).build()).not.toThrow(
              WeatherValidationError,
            )
          })
        })

        describe('pastHours', () => {
          it('should throw when pastHours is not an integer', () => {
            const builder = new QueryBuilder()
            expect(() => builder.latitude(0).longitude(0).pastHours(1.5).build()).toThrow(
              WeatherValidationError,
            )
          })

          it('should not throw when pastHours is an integer', () => {
            const builder = new QueryBuilder()
            expect(() => builder.latitude(0).longitude(0).pastHours(1).build()).not.toThrow(
              WeatherValidationError,
            )
          })
        })

        describe('forecastDays', () => {
          it('should throw when forecastDays is not an integer', () => {
            const builder = new QueryBuilder()
            expect(() => builder.latitude(0).longitude(0).forecastDays(1.5).build()).toThrow(
              WeatherValidationError,
            )
          })

          it('should not throw when forecastDays is an integer', () => {
            const builder = new QueryBuilder()
            expect(() => builder.latitude(0).longitude(0).forecastDays(1).build()).not.toThrow(
              WeatherValidationError,
            )
          })
        })

        describe('forecastHours', () => {
          it('should throw when forecastHours is not an integer', () => {
            const builder = new QueryBuilder()
            expect(() => builder.latitude(0).longitude(0).forecastHours(1.5).build()).toThrow(
              WeatherValidationError,
            )
          })

          it('should not throw when forecastHours is an integer', () => {
            const builder = new QueryBuilder()
            expect(() => builder.latitude(0).longitude(0).forecastHours(1).build()).not.toThrow(
              WeatherValidationError,
            )
          })
        })
      })
    })
  })

  describe('from() static method', () => {
    describe('return value', () => {
      it('should return a new instance of QueryBuilder', () => {
        const builder = QueryBuilder.from({ latitude: 40.7128, longitude: -74.006 })
        expect(builder).toBeInstanceOf(QueryBuilder)
      })
    })

    describe('required parameters', () => {
      it('should set scalar latitude and longitude values from the input object', () => {
        const builder = QueryBuilder.from({ latitude: 40.7128, longitude: -74.006 })
        const result = builder.build()
        expect(result.latitude).toBe('40.7128')
        expect(result.longitude).toBe('-74.006')
      })

      it('should set array latitude and longitude values from the input object', () => {
        const builder = QueryBuilder.from({
          latitude: [40.7128, 34.0522],
          longitude: [-74.006, -118.2437],
        })
        const result = builder.build()
        expect(result.latitude).toBe('40.7128,34.0522')
        expect(result.longitude).toBe('-74.006,-118.2437')
      })
    })

    describe('optional parameters', () => {
      it('should set provided parameters from the input object', () => {
        const builder = QueryBuilder.from({
          latitude: 40.7128,
          longitude: -74.006,
          hourly: ['temperature_2m', 'relative_humidity_300hPa'],
        })
        const result = builder.build()

        expect(result.latitude).toBe('40.7128')
        expect(result.longitude).toBe('-74.006')
        expect(result.hourly).toBe('temperature_2m,relative_humidity_300hPa')
      })

      it('should omit parameters not provided in the input object', () => {
        const builder = QueryBuilder.from({ latitude: 40.7128, longitude: -74.006 })
        const result = builder.build()

        expect(result.timezone).toBeUndefined()
        expect(result.hourly).toBeUndefined()
        expect(result.past_days).toBeUndefined()
      })
    })

    describe('zero value handling)', () => {
      it('should preserve elevation = 0 when provided in the input object', () => {
        const builder = QueryBuilder.from({ latitude: 40.7128, longitude: -74.006, elevation: 0 })
        const result = builder.build()

        expect(result.elevation).toBe('0')
      })

      it('should preserve pastDays = 0 when provided in the input object', () => {
        const builder = QueryBuilder.from({ latitude: 40.7128, longitude: -74.006, pastDays: 0 })
        const result = builder.build()

        expect(result.past_days).toBe('0')
      })

      it('should preserve forecastDays = 0 when provided in the input object', () => {
        const builder = QueryBuilder.from({
          latitude: 40.7128,
          longitude: -74.006,
          forecastDays: 0,
        })
        const result = builder.build()

        expect(result.forecast_days).toBe('0')
      })

      it('should preserve tilt = 0 when provided in the input object', () => {
        const builder = QueryBuilder.from({ latitude: 40.7128, longitude: -74.006, tilt: 0 })
        const result = builder.build()

        expect(result.tilt).toBe('0')
      })

      it('should preserve azimuth = 0 when provided in the input object', () => {
        const builder = QueryBuilder.from({ latitude: 40.7128, longitude: -74.006, azimuth: 0 })
        const result = builder.build()

        expect(result.azimuth).toBe('0')
      })
    })

    describe('fluent chaining', () => {
      it('should allow further method chaining after from()', () => {
        const builder = QueryBuilder.from({ latitude: 40.7128, longitude: -74.006 })
        const result = builder.hourly(['temperature_2m']).build()

        expect(result.latitude).toBe('40.7128')
        expect(result.longitude).toBe('-74.006')
        expect(result.hourly).toBe('temperature_2m')
      })
    })

    describe('deferred validation', () => {
      it('should not throw during from()', () => {
        expect(() => QueryBuilder.from({ latitude: 999, longitude: 0 })).not.toThrow()
      })

      it('should throw during build() if parameters are invalid', () => {
        const builder = QueryBuilder.from({ latitude: 999, longitude: 0 })
        expect(() => builder.build()).toThrow(WeatherValidationError)
      })
    })
  })

  describe('buildFrom() static method', () => {
    describe('return value', () => {
      it('should return a plain string map object', () => {
        const result = QueryBuilder.buildFrom({ latitude: 40.7128, longitude: -74.006 })
        expect(result).toEqual({ latitude: '40.7128', longitude: '-74.006' })
      })
    })

    describe('value conversion', () => {
      it('should conver number to string', () => {
        const result = QueryBuilder.buildFrom({ latitude: 40.7128, longitude: -74.006 })
        expect(result.latitude).toBe('40.7128')
        expect(result.longitude).toBe('-74.006')
      })

      it('should join array values with a comma', () => {
        const result = QueryBuilder.buildFrom({
          latitude: [40.7128, 34.0522],
          longitude: [-74.006, -118.2437],
        })
        expect(result.latitude).toBe('40.7128,34.0522')
        expect(result.longitude).toBe('-74.006,-118.2437')
      })
    })

    describe('validation', () => {
      it('should throw on out-of-range latitude', () => {
        expect(() => QueryBuilder.buildFrom({ latitude: 999, longitude: 0 })).toThrow(
          WeatherValidationError,
        )
      })
    })

    describe('equality with from() + build()', () => {
      it('should produce the same result as from() + build()', () => {
        const resultFromBuild = QueryBuilder.from({
          latitude: 40.7128,
          longitude: -74.006,
          hourly: ['temperature_2m', 'relative_humidity_300hPa'],
        }).build()
        const resultBuildFrom = QueryBuilder.buildFrom({
          latitude: 40.7128,
          longitude: -74.006,
          hourly: ['temperature_2m', 'relative_humidity_300hPa'],
        })

        expect(resultFromBuild).toEqual(resultBuildFrom)
      })
    })
  })
})
