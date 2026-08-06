// Types
export type {
  HourlyWeatherVariables,
  DailyWeatherVariables,
  CurrentWeatherVariables,
  Minutely15WeatherVariables,
} from './types/variables.js'

export type {
  QueryParams,
  TemperatureUnit,
  WindSpeedUnit,
  PrecipitationUnit,
  Timeformat,
  CellSelection,
  WeatherModel,
} from './types/query.js'

export type {
  RawWeatherResponse,
  RawHourlyWeatherResponse,
  RawDailyWeatherResponse,
  RawCurrentWeatherResponse,
  RawMinutelyWeatherResponse,
  WeatherResponse,
  HourlyWeatherConditions,
  DailyWeatherConditions,
  CurrentWeatherConditions,
  Minutely15WeatherConditions,
} from './types/response.js'

export type { WeatherAnalyzer } from './types/analyzer.js'

// HTTP
export { HttpClient } from './http/fetch-client.js'

export {
  WeatherError,
  WeatherAPIError,
  WeatherNetworkError,
  WeatherValidationError,
  WeatherMappingError,
} from './http/errors.js'
