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
  RawTimedBlock,
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

export { QueryBuilder } from './builder/query-builder.js'
export { mapWeatherResponse } from './mapper/weather-mapper.js'
export { WeatherClient } from './client.js'

// Analyzers
export { createFleetRiskAnalyzer } from './analyzers/fleet-risk.js'

export type {
  RiskLevel,
  FleetRiskData,
  FleetRiskExtension,
  FleetRiskThresholds,
} from './analyzers/fleet-risk.js'
