/**
 * Defines the types for query parameters used in the application.
 *
 * API Documentation: https://open-meteo.com/en/docs
 */

import type {
  HourlyWeatherVariables,
  DailyWeatherVariables,
  CurrentWeatherVariables,
  Minutely15WeatherVariables,
} from './variables.js'

/**
 * Open-Meteo Weather Forecast API Query Parameters
 */
export interface QueryParams {
  /**
   * Geographical WGS84 latitude coordinate of the location.
   *
   * @example
   * // Single latitude value
   * latitude: 37.7749
   *
   * @example
   * // Multiple latitude values for different locations
   * latitude: [37.7749, 34.0522, 40.7128]
   */
  latitude: number | number[]

  /**
   * Geographical WGS84 longitude coordinate of the location.
   *
   * @example
   * // Single longitude value
   * longitude: -122.4194
   *
   * @example
   * // Multiple longitude values for different locations
   * longitude: [-122.4194, -118.2437, -74.0059]
   */
  longitude: number | number[]

  /**
   * The elevation used for statistical downscaling.
   *
   * @default 90 - Use a 90-meter digital elevation model (DEM) by default.
   *
   * @example
   * // Single elevation value
   * elevation: 250.5
   *
   * @example
   * // Multiple elevation values for different locations
   * elevation: [100, 200, 300]
   *
   * @example
   * // Disable downscaling
   * elevation: 'nan'  
   */
  elevation?: number | number[] | 'nan'

  /**
   * A list of weather variables which should be returned.
   *
   * @example
   * // Request temperature and humidity
   * hourly: ['temperature_2m', 'relative_humidity_2m']
   */
  hourly?: HourlyWeatherVariables[]

  /**
   * A list of daily weather variable aggregations.
   *
   * @example
   * // Request daily maximum and minimum temperature
   * daily: ['temperature_2m_max', 'temperature_2m_min']
   */
  daily?: DailyWeatherVariables[]

  /**
   * A list of variables to return for the current conditions.
   *
   * @example
   * // Request current temperature and wind speed
   * current: ['temperature_2m', 'wind_speed_10m']
   */
  current?: CurrentWeatherVariables[]

  /**
   * A list of weather variables at 15-minute intervals.
   *
   * @example
   * // Request 15-minute temperature and precipitation
   * minutely_15: ['temperature_2m', 'precipitation']
   */
  minutely_15?: Minutely15WeatherVariables[]

  /**
   * The unit of temperature to be used in the response.
   *
   * {@link TemperatureUnit} defines the possible values for this parameter.
   *
   * @default 'celsius' - Use Celsius as the default temperature unit.
   */
  temperature_unit?: TemperatureUnit

  /**
   * The unit of wind speed to be used in the response.
   *
   * {@link WindSpeedUnit} defines the possible values for this parameter.
   *
   * @default 'kmh' - Use kilometers per hour as the default wind speed unit.
   */
  wind_speed_unit?: WindSpeedUnit

  /**
   * The unit of precipitation to be used in the response.
   *
   * {@link PrecipitationUnit} defines the possible values for this parameter.
   *
   * @default 'mm' - Use millimeters as the default precipitation unit.
   */
  precipitation_unit?: PrecipitationUnit

  /**
   * The format of the time values in the response.
   *
   * {@link Timeformat} defines the possible values for this parameter.
   *
   * @default 'iso8601' - Use ISO 8601 format as the default time format.
   */
  timeformat?: Timeformat

  /**
   * The timezone for the time values in the response.
   *
   * @description
   * - Use IANA timezone names (e.g., 'America/New_York', 'Europe/London') for specific timezones.
   * - Use 'auto' to automatically determine the timezone based on the provided latitude and longitude.
   *
   * @default 'GMT' - Use GMT as the default timezone.
   * @see Full list of IANA timezones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  timezone?: string | 'auto'

  /**
   * The number of past days to include in the response.
   *
   * - If `past_days` is set, historical data for previous days (e.g., yesterday or the day before) is also returned.
   *
   * @default 0 - Do not include any past data.
   *
   * @minimum 0
   * @maximum 92
   */
  past_days?: number

  /**
   * The number of forecast days to include in the response.
   *
   * @default 7 - Include forecast data for the next 7 days by default.
   *
   * @minimum 0
   * @maximum 16
   */
  forecast_days?: number

  /**
   * The number of hourly forecast timesteps to include in the response.
   */
  past_hours?: number

  /**
   * The number of future hourly forecast timesteps to include in the response.
   */
  forecast_hours?: number

  /**
   * Start date of the time interval in ISO 8601 format.
   *
   * @example
   * start_date: '2023-01-01'
   */
  start_date?: string

  /**
   * End date of the time interval in ISO 8601 format.
   *
   * @example
   * end_date: '2023-01-01'
   */
  end_date?: string

  /**
   * Slope tilt in degrees for global_tilted_irradiance calculation.
   *
   * @default 0
   */
  tilt?: number

  /**
   * Azimuth for global_tilted_irradiance. North=0, East=90, South=180, West=270.
   *
   * @default 0 - Use North as the default azimuth.
   */
  azimuth?: number

  /**
   * Grid cell selection preference: land, sea, or nearest.
   *
   * {@link CellSelection} defines the possible values for this parameter.
   */
  cell_selection?: CellSelection

  /**
   * Only required for commercial subscriptions.
   */
  apikey?: string

  /**
   * Manually select one or more weather models.
   * The default Best Match provides the best forecast for any given location worldwide. Seamless combines all models from a given provider into a seamless prediction
   *
   * @default ["best_match"]
   * @example ["ecmwf_ifs025", "jma_seamless"]
   */
  models?: WeatherModel | WeatherModel[]
}
// HourlyWeatherVariables, DailyWeatherVariables, CurrentWeatherVariables,
// and Minutely15WeatherVariables are now defined in ./variables.js

/**
 * Temperature units that can be used in the Open-Meteo Weather Forecast API.
 */
export type TemperatureUnit = 'celsius' | 'fahrenheit'

/**
 * Wind speed units that can be used in the Open-Meteo Weather Forecast API.
 */
export type WindSpeedUnit = 'kmh' | 'ms' | 'mph' | 'kn'

/**
 * Precipitation units that can be used in the Open-Meteo Weather Forecast API.
 */
export type PrecipitationUnit = 'mm' | 'inch'

/**
 * Timeformat options that can be used in the Open-Meteo Weather Forecast API.
 * - `'iso8601'`: (Default) Returns time values as ISO 8601 formatted strings.
 * - `'unixtime'`: Returns time values in UNIX epoch time (in seconds).
 *   Please note that all timestamps are in GMT+0! For daily values with unix timestamps,
 *   please apply `utc_offset_seconds` again to get the correct local date.
 */
export type Timeformat = 'iso8601' | 'unixtime'

/**
 * Cell selection options that can be used in the Open-Meteo Weather Forecast API.
 * - `'land'`: Selects the nearest land grid cell.
 * - `'sea'`: Selects the nearest sea grid cell.
 * - `'nearest'`: Selects the nearest grid cell regardless of land or sea.
 */
export type CellSelection = 'land' | 'sea' | 'nearest'

/**
 * Weather models that can be used in the Open-Meteo Weather Forecast API.
 * Each entry provides the institution/model name, geographic coverage, and spatial resolution.
 */
export type WeatherModel =
  /** Automatically select the best model for the requested coordinates (Recommended) */
  | 'best_match'

  // --- ECMWF (European Centre for Medium-Range Weather Forecasts) ---
  /** ECMWF Integrated Forecasting System (Global, 9 km / 0.1°) */
  | 'ecmwf_ifs'
  /** ECMWF IFS High Resolution (Global, 25 km / 0.25°) */
  | 'ecmwf_ifs025'
  /** ECMWF Artificial Intelligence Integrated Forecasting System (Global, 25 km / 0.25°) */
  | 'ecmwf_aifs025_single'

  // --- CMA & BOM ---
  /** CMA GRAPES Global - China Meteorological Administration (Global, 15 km) */
  | 'cma_grapes_global'
  /** BOM ACCESS Global - Australia Bureau of Meteorology (Global, 15 km) */
  | 'bom_access_global'

  // --- NOAA / NCEP (United States) ---
  /** NOAA GFS Seamless - Auto-combines HRRR, NAM, and GFS (Global, Seamless 3 km -> 25 km) */
  | 'ncep_gfs_seamless'
  /** NOAA Global Forecast System (Global, 25 km / 0.25°) */
  | 'ncep_gfs_global'
  /** NOAA High-Resolution Rapid Refresh (US CONUS only, 3 km) */
  | 'ncep_hrrr_conus'
  /** NOAA National Blend of Models (US CONUS only, 2.5 km) */
  | 'ncep_nbm_conus'
  /** NOAA North American Mesoscale Forecast System (US CONUS only, 3 km) */
  | 'ncep_nam_conus'
  /** NOAA GFS GraphCast AI Forecast Model (Global, 25 km / 0.25°) */
  | 'ncep_gfs_graphcast025'
  /** NOAA Artificial Intelligence GFS (Global, 25 km / 0.25°) */
  | 'ncep_aigfs025'
  /** NOAA Global Ensemble Forecast System Ensemble Mean (Global, 25 km / 0.25°) */
  | 'ncep_hgefs025_ensemble_mean'

  // --- JMA (Japan Meteorological Agency) ---
  /** JMA Seamless - Auto-combines MSM and GSM (Japan & Global, Seamless 5 km -> 25 km) */
  | 'jma_seamless'
  /** JMA Meso-Scale Model (Japan only, 5 km) */
  | 'jma_msm'
  /** JMA Global Spectral Model (Global, 25 km / 0.25°) */
  | 'jma_gsm'

  // --- KMA (Korea Meteorological Administration) ---
  /** KMA Seamless - Auto-combines LDPS and GDPS (Korea & Global, Seamless 1.5 km -> 10 km) */
  | 'kma_seamless'
  /** KMA Local Data Assimilation and Prediction System (South Korea only, 1.5 km) */
  | 'kma_ldps'
  /** KMA Global Data Assimilation and Prediction System (Global, 10 km) */
  | 'kma_gdps'

  // --- DWD ICON (German Weather Service) ---
  /** DWD ICON Seamless - Auto-combines ICON-D2, EU, and Global (Global, Seamless 2.2 km -> 11 km) */
  | 'icon_seamless'
  /** DWD ICON Global (Global, 11 km) */
  | 'icon_global'
  /** DWD ICON Europe (Europe only, 7 km) */
  | 'icon_eu'
  /** DWD ICON-D2 High Resolution (Germany & Surrounding Countries, 2.2 km) */
  | 'icon_d2'

  // --- CMC GEM (Canadian Meteorological Centre) ---
  /** CMC GEM Seamless - Auto-combines HRDPS, RDPS, and GDPS (Global, Seamless 2.5 km -> 15 km) */
  | 'cmc_gem_seamless'
  /** CMC Global Deterministic Prediction System (Global, 15 km) */
  | 'cmc_gem_gdps'
  /** CMC Regional Deterministic Prediction System (North America, 10 km) */
  | 'cmc_gem_rdps'
  /** CMC High Resolution Deterministic Prediction System (Canada & Northern US, 2.5 km) */
  | 'cmc_gem_hrdps'
  /** CMC High Resolution Deterministic Prediction System West (Western Canada, 2.5 km) */
  | 'cmc_gem_hrdps_west'

  // --- Météo-France ---
  /** Météo-France Seamless - Auto-combines AROME and ARPEGE (Global, Seamless 1.3 km -> 25 km) */
  | 'meteofrance_seamless'
  /** Météo-France ARPEGE World (Global, 25 km / 0.25°) */
  | 'meteofrance_arpege_world'
  /** Météo-France ARPEGE Europe (Europe only, 10 km / 0.1°) */
  | 'meteofrance_arpege_europe'
  /** Météo-France AROME France (France only, 2.5 km) */
  | 'meteofrance_arome_france'
  /** Météo-France AROME France High Definition (France only, 1.3 km) */
  | 'meteofrance_arome_france_hd'

  // --- ItaliaMeteo & Arpae ---
  /** ItaliaMeteo / Arpae ICON-2I (Italy only, 2.2 km) */
  | 'italia_meteo_arpae_icon_2i'

  // --- MET Norway ---
  /** MET Norway Seamless - Auto-combines Nordic and Global models (Nordic & Global, Seamless 1 km -> 9 km) */
  | 'metno_seamless'
  /** MET Norway MEPS Nordic (Scandinavia & Nordic countries, 1 km) */
  | 'metno_nordic'

  // --- KNMI (Royal Netherlands Meteorological Institute) ---
  /** KNMI Seamless - Auto-combines HARMONIE-AROME and ECMWF (Global, Seamless 2 km -> 9 km) */
  | 'knmi_seamless'
  /** KNMI HARMONIE-AROME Europe (Europe only, 2.5 km) */
  | 'knmi_harmonie_arome_europe'
  /** KNMI HARMONIE-AROME Netherlands (Netherlands only, 2 km) */
  | 'knmi_harmonie_arome_netherlands'

  // --- DMI (Danish Meteorological Institute) ---
  /** DMI Seamless - Auto-combines HARMONIE-AROME and ECMWF (Global, Seamless 2.5 km -> 9 km) */
  | 'dmi_seamless'
  /** DMI HARMONIE-AROME Europe (Europe & Scandinavia, 2.5 km) */
  | 'dmi_harmonie_arome_europe'

  // --- UKMO (UK Met Office) ---
  /** UKMO Seamless - Auto-combines UK 2km and Global 10km models (Global, Seamless 2 km -> 10 km) */
  | 'ukmo_seamless'
  /** UK Met Office Global Deterministic (Global, 10 km) */
  | 'ukmo_global_deterministic_10km'
  /** UK Met Office UK Deterministic (UK only, 2 km) */
  | 'ukmo_uk_deterministic_2km'

  // --- MeteoSwiss ---
  /** MeteoSwiss ICON Seamless - Auto-combines CH1/CH2 and Global (Global, Seamless 1 km -> 11 km) */
  | 'meteoswiss_icon_seamless'
  /** MeteoSwiss ICON-CH1 High Resolution (Switzerland only, 1 km) */
  | 'meteoswiss_icon_ch1'
  /** MeteoSwiss ICON-CH2 Regional (Switzerland & Central Europe, 2 km) */
  | 'meteoswiss_icon_ch2'

  // --- GeoSphere Austria ---
  /** GeoSphere Austria Seamless - Auto-combines AROME and ECMWF (Global, Seamless 2.5 km -> 9 km) */
  | 'geosphere_seamless'
  /** GeoSphere Austria AROME (Austria & Central Europe, 2.5 km) */
  | 'geosphere_arome_austria'
