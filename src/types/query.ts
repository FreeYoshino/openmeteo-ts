/**
 * Defines the types for query parameters used in the application.
 *
 * API Documentation: https://open-meteo.com/en/docs
 */

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
  hourly?: HourlyWeatherVariables

  /**
   * A list of daily weather variable aggregations.
   *
   * @example
   * // Request daily maximum and minimum temperature
   * daily: ['temperature_2m_max', 'temperature_2m_min']
   */
  daily?: DailyWeatherVariables

  /**
   * A list of variables to return for the current conditions.
   *
   * @example
   * // Request current temperature and wind speed
   * current: ['temperature_2m', 'wind_speed_10m']
   */
  current?: CurrentWeatherVariables

  /**
   * A list of weather variables at 15-minute intervals.
   *
   * @example
   * // Request 15-minute temperature and precipitation
   * minutely_15: ['temperature_2m', 'precipitation']
   */
  minutely_15?: Minutely15WeatherVariables

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

/**
 * Hourly variables that can be requested from the Open-Meteo Weather Forecast API.
 */
export type HourlyWeatherVariables =
  // -------------------------------------------------------------------------
  // Temperature & Apparent Temperature
  // -------------------------------------------------------------------------
  /** Air temperature at 2 meters above ground */
  | 'temperature_2m'
  /** Minimum air temperature at 2 meters above ground over the preceding hour */
  | 'temperature_2m_min'
  /** Maximum air temperature at 2 meters above ground over the preceding hour */
  | 'temperature_2m_max'
  /** Perceived temperature combining wind chill and heat index at 2 meters */
  | 'apparent_temperature'
  /** Wet bulb temperature at 2 meters above ground */
  | 'wet_bulb_temperature_2m'
  /** Dew point temperature at 2 meters above ground */
  | 'dew_point_2m'
  /** Altitude above sea level where the temperature drops to 0°C */
  | 'freezing_level_height'
  /** Temperature of the ground surface */
  | 'surface_temperature'
  /** Air temperature at 20 meters above ground */
  | 'temperature_20m'
  /** Air temperature at 40 meters above ground */
  | 'temperature_40m'
  /** Air temperature at 50 meters above ground */
  | 'temperature_50m'
  /** Air temperature at 80 meters above ground */
  | 'temperature_80m'
  /** Air temperature at 100 meters above ground */
  | 'temperature_100m'
  /** Air temperature at 120 meters above ground */
  | 'temperature_120m'
  /** Air temperature at 150 meters above ground */
  | 'temperature_150m'
  /** Air temperature at 180 meters above ground */
  | 'temperature_180m'
  /** Air temperature at 200 meters above ground */
  | 'temperature_200m'

  // -------------------------------------------------------------------------
  // Humidity, Clouds & Visibility
  // -------------------------------------------------------------------------
  /** Relative humidity at 2 meters above ground */
  | 'relative_humidity_2m'
  /** Total cloud cover as an area fraction (0-100%) */
  | 'cloud_cover'
  /** Low level clouds and fog up to 3 km altitude */
  | 'cloud_cover_low'
  /** Mid level clouds from 3 to 8 km altitude */
  | 'cloud_cover_mid'
  /** High level clouds from 8 km altitude */
  | 'cloud_cover_high'
  /** Horizontal viewing distance in meters */
  | 'visibility'
  /** Vapour Pressure Deficit (VPD) at 2 meters in kilopascals */
  | 'vapour_pressure_deficit'
  /** Total atmospheric water vapor column in kilograms per square meter */
  | 'total_column_integrated_water_vapour'
  /** Height of the base of convective clouds */
  | 'convective_cloud_base'
  /** Height of the top of convective clouds */
  | 'convective_cloud_top'

  // -------------------------------------------------------------------------
  // Precipitation & Rain
  // -------------------------------------------------------------------------
  /** Total precipitation (rain, showers, snow) of the preceding hour */
  | 'precipitation'
  /** Probability of precipitation occurring in the preceding hour */
  | 'precipitation_probability'
  /** Categorical precipitation type (0: None, 1: Rain, 2: Freezing Rain, etc.) */
  | 'precipitation_type'
  /** Rain from large scale weather systems of the preceding hour */
  | 'rain'
  /** Probability of rain occurring in the preceding hour */
  | 'rain_probability'
  /** Showers from convective precipitation of the preceding hour */
  | 'showers'
  /** Probability of freezing rain occurring in the preceding hour */
  | 'freezing_rain_probability'
  /** Probability of ice pellets occurring in the preceding hour */
  | 'ice_pellets_probability'
  /** Probability of thunderstorms occurring in the preceding hour */
  | 'thunderstorm_probability'

  // -------------------------------------------------------------------------
  // Snow & Ice
  // -------------------------------------------------------------------------
  /** Snowfall amount of the preceding hour in centimeters */
  | 'snowfall'
  /** Probability of snowfall occurring in the preceding hour */
  | 'snowfall_probability'
  /** Total snow depth on the ground in meters */
  | 'snow_depth'
  /** Liquid water equivalent of snowfall in millimeters */
  | 'snowfall_water_equivalent'
  /** Liquid water equivalent of the total snow depth in millimeters */
  | 'snow_depth_water_equivalent'
  /** Altitude where snowfall begins to accumulate */
  | 'snowfall_height'
  /** Measured height of snow cover */
  | 'snow_height'
  /** Thickness of sea ice layer */
  | 'sea_ice_thickness'

  // -------------------------------------------------------------------------
  // Pressure & Atmospheric Dynamics
  // -------------------------------------------------------------------------
  /** Atmospheric pressure at the ground surface */
  | 'surface_pressure'
  /** Atmospheric air pressure reduced to mean sea level */
  | 'pressure_msl'
  /** Height of the atmospheric planetary boundary layer */
  | 'boundary_layer_height'
  /** Atmospheric air mass density at 8 meters above ground */
  | 'mass_density_8m'

  // -------------------------------------------------------------------------
  // Wind Speed, Gusts & Direction
  // -------------------------------------------------------------------------
  /** Wind speed at 10 meters above ground */
  | 'wind_speed_10m'
  /** Wind speed at 20 meters above ground */
  | 'wind_speed_20m'
  /** Wind speed at 30 meters above ground */
  | 'wind_speed_30m'
  /** Wind speed at 40 meters above ground */
  | 'wind_speed_40m'
  /** Wind speed at 50 meters above ground */
  | 'wind_speed_50m'
  /** Wind speed at 70 meters above ground */
  | 'wind_speed_70m'
  /** Wind speed at 80 meters above ground */
  | 'wind_speed_80m'
  /** Wind speed at 100 meters above ground */
  | 'wind_speed_100m'
  /** Wind speed at 120 meters above ground */
  | 'wind_speed_120m'
  /** Wind speed at 140 meters above ground */
  | 'wind_speed_140m'
  /** Wind speed at 150 meters above ground */
  | 'wind_speed_150m'
  /** Wind speed at 160 meters above ground */
  | 'wind_speed_160m'
  /** Wind speed at 180 meters above ground */
  | 'wind_speed_180m'
  /** Wind speed at 200 meters above ground */
  | 'wind_speed_200m'
  /** Wind direction at 10 meters above ground in degrees */
  | 'wind_direction_10m'
  /** Wind direction at 20 meters above ground in degrees */
  | 'wind_direction_20m'
  /** Wind direction at 30 meters above ground in degrees */
  | 'wind_direction_30m'
  /** Wind direction at 40 meters above ground in degrees */
  | 'wind_direction_40m'
  /** Wind direction at 50 meters above ground in degrees */
  | 'wind_direction_50m'
  /** Wind direction at 70 meters above ground in degrees */
  | 'wind_direction_70m'
  /** Wind direction at 80 meters above ground in degrees */
  | 'wind_direction_80m'
  /** Wind direction at 100 meters above ground in degrees */
  | 'wind_direction_100m'
  /** Wind direction at 120 meters above ground in degrees */
  | 'wind_direction_120m'
  /** Wind direction at 140 meters above ground in degrees */
  | 'wind_direction_140m'
  /** Wind direction at 150 meters above ground in degrees */
  | 'wind_direction_150m'
  /** Wind direction at 160 meters above ground in degrees */
  | 'wind_direction_160m'
  /** Wind direction at 180 meters above ground in degrees */
  | 'wind_direction_180m'
  /** Wind direction at 200 meters above ground in degrees */
  | 'wind_direction_200m'
  /** Maximum wind gust speed at 10 meters above ground */
  | 'wind_gusts_10m'
  /** Vertical wind velocity updraft speed */
  | 'updraft'
  /** Aerodynamic surface roughness length */
  | 'roughness_length'

  // -------------------------------------------------------------------------
  // Solar Radiation, UV & Sun
  // -------------------------------------------------------------------------
  /** Daily UV Index according to WHO guidelines */
  | 'uv_index'
  /** UV Index assuming clear sky conditions */
  | 'uv_index_clear_sky'
  /** 1 if the current time step has daylight, 0 at night */
  | 'is_day'
  /** Number of seconds of sunshine per hour (> 120 W/m²) */
  | 'sunshine_duration'
  /** Total shortwave solar radiation reaching the horizontal surface */
  | 'shortwave_radiation'
  /** Direct solar radiation reaching the horizontal surface */
  | 'direct_radiation'
  /** Diffuse solar radiation reaching the horizontal surface */
  | 'diffuse_radiation'
  /** Direct solar radiation perpendicular to the sun's rays */
  | 'direct_normal_irradiance'
  /** Total radiation received on a tilted surface */
  | 'global_tilted_irradiance'
  /** Thermal infrared radiation emitted by the Earth */
  | 'terrestrial_radiation'
  /** Instantaneous shortwave radiation at the exact timestamp */
  | 'shortwave_radiation_instant'
  /** Instantaneous direct radiation at the exact timestamp */
  | 'direct_radiation_instant'
  /** Instantaneous diffuse radiation at the exact timestamp */
  | 'diffuse_radiation_instant'
  /** Instantaneous direct normal irradiance at the exact timestamp */
  | 'direct_normal_irradiance_instant'
  /** Instantaneous global tilted irradiance at the exact timestamp */
  | 'global_tilted_irradiance_instant'
  /** Instantaneous terrestrial radiation at the exact timestamp */
  | 'terrestrial_radiation_instant'
  /** Fraction of solar radiation reflected by the surface (0 to 1) */
  | 'albedo'

  // -------------------------------------------------------------------------
  // Evaporation, Soil Moisture & Runoff
  // -------------------------------------------------------------------------
  /** Evapotranspiration from land surface and plants */
  | 'evapotranspiration'
  /** Reference evapotranspiration of a well-watered grass field (FAO-56) */
  | 'et0_fao_evapotranspiration'
  /** Excess water that flows over land surface after precipitation */
  | 'runoff'
  /** Volumetric soil moisture content at 0 to 1 cm depth */
  | 'soil_moisture_0_to_1cm'
  /** Volumetric soil moisture content at 1 to 3 cm depth */
  | 'soil_moisture_1_to_3cm'
  /** Volumetric soil moisture content at 3 to 9 cm depth */
  | 'soil_moisture_3_to_9cm'
  /** Volumetric soil moisture content at 9 to 27 cm depth */
  | 'soil_moisture_9_to_27cm'
  /** Volumetric soil moisture content at 27 to 81 cm depth */
  | 'soil_moisture_27_to_81cm'
  /** Volumetric soil moisture content at 81 to 243 cm depth */
  | 'soil_moisture_81_to_243cm'
  /** Volumetric soil moisture content at 243 to 729 cm depth */
  | 'soil_moisture_243_to_729cm'
  /** Volumetric soil moisture content at 729 to 2187 cm depth */
  | 'soil_moisture_729_to_2187cm'
  /** Volumetric soil moisture content at 0 to 7 cm depth */
  | 'soil_moisture_0_to_7cm'
  /** Volumetric soil moisture content at 7 to 28 cm depth */
  | 'soil_moisture_7_to_28cm'
  /** Volumetric soil moisture content at 28 to 100 cm depth */
  | 'soil_moisture_28_to_100cm'
  /** Volumetric soil moisture content at 100 to 255 cm depth */
  | 'soil_moisture_100_to_255cm'
  /** Volumetric soil moisture content at 0 to 10 cm depth */
  | 'soil_moisture_0_to_10cm'
  /** Volumetric soil moisture content at 10 to 40 cm depth */
  | 'soil_moisture_10_to_40cm'
  /** Volumetric soil moisture content at 40 to 100 cm depth */
  | 'soil_moisture_40_to_100cm'
  /** Volumetric soil moisture content at 100 to 200 cm depth */
  | 'soil_moisture_100_to_200cm'
  /** Volumetric soil moisture content at 10 to 35 cm depth */
  | 'soil_moisture_10_to_35cm'
  /** Volumetric soil moisture content at 35 to 100 cm depth */
  | 'soil_moisture_35_to_100cm'
  /** Volumetric soil moisture content at 100 to 300 cm depth */
  | 'soil_moisture_100_to_300cm'

  // -------------------------------------------------------------------------
  // Soil Temperature
  // -------------------------------------------------------------------------
  /** Soil temperature at 0 cm depth */
  | 'soil_temperature_0cm'
  /** Soil temperature at 6 cm depth */
  | 'soil_temperature_6cm'
  /** Soil temperature at 18 cm depth */
  | 'soil_temperature_18cm'
  /** Soil temperature at 54 cm depth */
  | 'soil_temperature_54cm'
  /** Soil temperature at 162 cm depth */
  | 'soil_temperature_162cm'
  /** Soil temperature at 486 cm depth */
  | 'soil_temperature_486cm'
  /** Soil temperature at 1458 cm depth */
  | 'soil_temperature_1458cm'
  /** Average soil temperature from 0 to 7 cm depth */
  | 'soil_temperature_0_to_7cm'
  /** Average soil temperature from 7 to 28 cm depth */
  | 'soil_temperature_7_to_28cm'
  /** Average soil temperature from 28 to 100 cm depth */
  | 'soil_temperature_28_to_100cm'
  /** Average soil temperature from 100 to 255 cm depth */
  | 'soil_temperature_100_to_255cm'
  /** Average soil temperature from 0 to 10 cm depth */
  | 'soil_temperature_0_to_10cm'
  /** Average soil temperature from 10 to 40 cm depth */
  | 'soil_temperature_10_to_40cm'
  /** Average soil temperature from 40 to 100 cm depth */
  | 'soil_temperature_40_to_100cm'
  /** Average soil temperature from 100 to 200 cm depth */
  | 'soil_temperature_100_to_200cm'
  /** Average soil temperature from 10 to 35 cm depth */
  | 'soil_temperature_10_to_35cm'
  /** Average soil temperature from 35 to 100 cm depth */
  | 'soil_temperature_35_to_100cm'
  /** Average soil temperature from 100 to 300 cm depth */
  | 'soil_temperature_100_to_300cm'

  // -------------------------------------------------------------------------
  // Convection, Instability & Lightning
  // -------------------------------------------------------------------------
  /** WMO Weather interpretation code (0: Clear, 1-3: Cloudy, 61-63: Rain, etc.) */
  | 'weather_code'
  /** Convective Available Potential Energy (CAPE) in Joules per kilogram */
  | 'cape'
  /** Lifted Index (LI) indicating atmospheric instability */
  | 'lifted_index'
  /** Convective Inhibition (CIN) preventing cloud formation */
  | 'convective_inhibition'
  /** Probability of lightning strikes occurring in the area */
  | 'lightning_potential'
  /** Density of lightning strikes per square kilometer */
  | 'lightning_density'
  /** K-Index measuring thunderstorm potential */
  | 'k_index'

  // -------------------------------------------------------------------------
  // Ocean & Marine
  // -------------------------------------------------------------------------
  /** Sea level height relative to mean sea level */
  | 'sea_level_height_msl'
  /** Sea surface water temperature */
  | 'sea_surface_temperature'
  /** Speed of the ocean water current */
  | 'ocean_current_velocity'
  /** Direction of the ocean water current in degrees */
  | 'ocean_current_direction'

  // -------------------------------------------------------------------------
  // Upper-Air Pressure Level Variables (1000 hPa to 10 hPa)
  // -------------------------------------------------------------------------
  /** Air temperature at the 1000 hPa pressure level */
  | 'temperature_1000hPa'
  /** Air temperature at the 950 hPa pressure level */
  | 'temperature_950hPa'
  /** Air temperature at the 925 hPa pressure level */
  | 'temperature_925hPa'
  /** Air temperature at the 900 hPa pressure level */
  | 'temperature_900hPa'
  /** Air temperature at the 850 hPa pressure level (~1.5 km altitude) */
  | 'temperature_850hPa'
  /** Air temperature at the 800 hPa pressure level */
  | 'temperature_800hPa'
  /** Air temperature at the 750 hPa pressure level */
  | 'temperature_750hPa'
  /** Air temperature at the 700 hPa pressure level (~3 km altitude) */
  | 'temperature_700hPa'
  /** Air temperature at the 650 hPa pressure level */
  | 'temperature_650hPa'
  /** Air temperature at the 600 hPa pressure level */
  | 'temperature_600hPa'
  /** Air temperature at the 550 hPa pressure level */
  | 'temperature_550hPa'
  /** Air temperature at the 500 hPa pressure level (~5.5 km altitude) */
  | 'temperature_500hPa'
  /** Air temperature at the 450 hPa pressure level */
  | 'temperature_450hPa'
  /** Air temperature at the 400 hPa pressure level */
  | 'temperature_400hPa'
  /** Air temperature at the 350 hPa pressure level */
  | 'temperature_350hPa'
  /** Air temperature at the 300 hPa pressure level (~9 km altitude) */
  | 'temperature_300hPa'
  /** Air temperature at the 275 hPa pressure level */
  | 'temperature_275hPa'
  /** Air temperature at the 250 hPa pressure level (~10.5 km altitude) */
  | 'temperature_250hPa'
  /** Air temperature at the 225 hPa pressure level */
  | 'temperature_225hPa'
  /** Air temperature at the 200 hPa pressure level (~12 km altitude) */
  | 'temperature_200hPa'
  /** Air temperature at the 175 hPa pressure level */
  | 'temperature_175hPa'
  /** Air temperature at the 150 hPa pressure level */
  | 'temperature_150hPa'
  /** Air temperature at the 125 hPa pressure level */
  | 'temperature_125hPa'
  /** Air temperature at the 100 hPa pressure level (~16 km altitude) */
  | 'temperature_100hPa'
  /** Air temperature at the 50 hPa pressure level (~20 km altitude) */
  | 'temperature_50hPa'
  /** Air temperature at the 10 hPa pressure level (~30 km altitude) */
  | 'temperature_10hPa'
  /** Dew point temperature at the 1000 hPa pressure level */
  | 'dew_point_1000hPa'
  /** Dew point temperature at the 950 hPa pressure level */
  | 'dew_point_950hPa'
  /** Dew point temperature at the 925 hPa pressure level */
  | 'dew_point_925hPa'
  /** Dew point temperature at the 900 hPa pressure level */
  | 'dew_point_900hPa'
  /** Dew point temperature at the 850 hPa pressure level */
  | 'dew_point_850hPa'
  /** Dew point temperature at the 800 hPa pressure level */
  | 'dew_point_800hPa'
  /** Dew point temperature at the 750 hPa pressure level */
  | 'dew_point_750hPa'
  /** Dew point temperature at the 700 hPa pressure level */
  | 'dew_point_700hPa'
  /** Dew point temperature at the 650 hPa pressure level */
  | 'dew_point_650hPa'
  /** Dew point temperature at the 600 hPa pressure level */
  | 'dew_point_600hPa'
  /** Dew point temperature at the 550 hPa pressure level */
  | 'dew_point_550hPa'
  /** Dew point temperature at the 500 hPa pressure level */
  | 'dew_point_500hPa'
  /** Dew point temperature at the 450 hPa pressure level */
  | 'dew_point_450hPa'
  /** Dew point temperature at the 400 hPa pressure level */
  | 'dew_point_400hPa'
  /** Dew point temperature at the 350 hPa pressure level */
  | 'dew_point_350hPa'
  /** Dew point temperature at the 300 hPa pressure level */
  | 'dew_point_300hPa'
  /** Dew point temperature at the 275 hPa pressure level */
  | 'dew_point_275hPa'
  /** Dew point temperature at the 250 hPa pressure level */
  | 'dew_point_250hPa'
  /** Dew point temperature at the 225 hPa pressure level */
  | 'dew_point_225hPa'
  /** Dew point temperature at the 200 hPa pressure level */
  | 'dew_point_200hPa'
  /** Dew point temperature at the 175 hPa pressure level */
  | 'dew_point_175hPa'
  /** Dew point temperature at the 150 hPa pressure level */
  | 'dew_point_150hPa'
  /** Dew point temperature at the 125 hPa pressure level */
  | 'dew_point_125hPa'
  /** Dew point temperature at the 100 hPa pressure level */
  | 'dew_point_100hPa'
  /** Dew point temperature at the 50 hPa pressure level */
  | 'dew_point_50hPa'
  /** Dew point temperature at the 10 hPa pressure level */
  | 'dew_point_10hPa'
  /** Relative humidity at the 1000 hPa pressure level */
  | 'relative_humidity_1000hPa'
  /** Relative humidity at the 950 hPa pressure level */
  | 'relative_humidity_950hPa'
  /** Relative humidity at the 925 hPa pressure level */
  | 'relative_humidity_925hPa'
  /** Relative humidity at the 900 hPa pressure level */
  | 'relative_humidity_900hPa'
  /** Relative humidity at the 850 hPa pressure level */
  | 'relative_humidity_850hPa'
  /** Relative humidity at the 800 hPa pressure level */
  | 'relative_humidity_800hPa'
  /** Relative humidity at the 750 hPa pressure level */
  | 'relative_humidity_750hPa'
  /** Relative humidity at the 700 hPa pressure level */
  | 'relative_humidity_700hPa'
  /** Relative humidity at the 650 hPa pressure level */
  | 'relative_humidity_650hPa'
  /** Relative humidity at the 600 hPa pressure level */
  | 'relative_humidity_600hPa'
  /** Relative humidity at the 550 hPa pressure level */
  | 'relative_humidity_550hPa'
  /** Relative humidity at the 500 hPa pressure level */
  | 'relative_humidity_500hPa'
  /** Relative humidity at the 450 hPa pressure level */
  | 'relative_humidity_450hPa'
  /** Relative humidity at the 400 hPa pressure level */
  | 'relative_humidity_400hPa'
  /** Relative humidity at the 350 hPa pressure level */
  | 'relative_humidity_350hPa'
  /** Relative humidity at the 300 hPa pressure level */
  | 'relative_humidity_300hPa'
  /** Relative humidity at the 275 hPa pressure level */
  | 'relative_humidity_275hPa'
  /** Relative humidity at the 250 hPa pressure level */
  | 'relative_humidity_250hPa'
  /** Relative humidity at the 225 hPa pressure level */
  | 'relative_humidity_225hPa'
  /** Relative humidity at the 200 hPa pressure level */
  | 'relative_humidity_200hPa'
  /** Relative humidity at the 175 hPa pressure level */
  | 'relative_humidity_175hPa'
  /** Relative humidity at the 150 hPa pressure level */
  | 'relative_humidity_150hPa'
  /** Relative humidity at the 125 hPa pressure level */
  | 'relative_humidity_125hPa'
  /** Relative humidity at the 100 hPa pressure level */
  | 'relative_humidity_100hPa'
  /** Relative humidity at the 50 hPa pressure level */
  | 'relative_humidity_50hPa'
  /** Relative humidity at the 10 hPa pressure level */
  | 'relative_humidity_10hPa'
  /** Cloud cover fraction at the 1000 hPa pressure level */
  | 'cloud_cover_1000hPa'
  /** Cloud cover fraction at the 950 hPa pressure level */
  | 'cloud_cover_950hPa'
  /** Cloud cover fraction at the 925 hPa pressure level */
  | 'cloud_cover_925hPa'
  /** Cloud cover fraction at the 900 hPa pressure level */
  | 'cloud_cover_900hPa'
  /** Cloud cover fraction at the 850 hPa pressure level */
  | 'cloud_cover_850hPa'
  /** Cloud cover fraction at the 800 hPa pressure level */
  | 'cloud_cover_800hPa'
  /** Cloud cover fraction at the 750 hPa pressure level */
  | 'cloud_cover_750hPa'
  /** Cloud cover fraction at the 700 hPa pressure level */
  | 'cloud_cover_700hPa'
  /** Cloud cover fraction at the 650 hPa pressure level */
  | 'cloud_cover_650hPa'
  /** Cloud cover fraction at the 600 hPa pressure level */
  | 'cloud_cover_600hPa'
  /** Cloud cover fraction at the 550 hPa pressure level */
  | 'cloud_cover_550hPa'
  /** Cloud cover fraction at the 500 hPa pressure level */
  | 'cloud_cover_500hPa'
  /** Cloud cover fraction at the 450 hPa pressure level */
  | 'cloud_cover_450hPa'
  /** Cloud cover fraction at the 400 hPa pressure level */
  | 'cloud_cover_400hPa'
  /** Cloud cover fraction at the 350 hPa pressure level */
  | 'cloud_cover_350hPa'
  /** Cloud cover fraction at the 300 hPa pressure level */
  | 'cloud_cover_300hPa'
  /** Cloud cover fraction at the 275 hPa pressure level */
  | 'cloud_cover_275hPa'
  /** Cloud cover fraction at the 250 hPa pressure level */
  | 'cloud_cover_250hPa'
  /** Cloud cover fraction at the 225 hPa pressure level */
  | 'cloud_cover_225hPa'
  /** Cloud cover fraction at the 200 hPa pressure level */
  | 'cloud_cover_200hPa'
  /** Cloud cover fraction at the 175 hPa pressure level */
  | 'cloud_cover_175hPa'
  /** Cloud cover fraction at the 150 hPa pressure level */
  | 'cloud_cover_150hPa'
  /** Cloud cover fraction at the 125 hPa pressure level */
  | 'cloud_cover_125hPa'
  /** Cloud cover fraction at the 100 hPa pressure level */
  | 'cloud_cover_100hPa'
  /** Cloud cover fraction at the 50 hPa pressure level */
  | 'cloud_cover_50hPa'
  /** Cloud cover fraction at the 10 hPa pressure level */
  | 'cloud_cover_10hPa'
  /** Wind speed at the 1000 hPa pressure level */
  | 'wind_speed_1000hPa'
  /** Wind speed at the 950 hPa pressure level */
  | 'wind_speed_950hPa'
  /** Wind speed at the 925 hPa pressure level */
  | 'wind_speed_925hPa'
  /** Wind speed at the 900 hPa pressure level */
  | 'wind_speed_900hPa'
  /** Wind speed at the 850 hPa pressure level */
  | 'wind_speed_850hPa'
  /** Wind speed at the 800 hPa pressure level */
  | 'wind_speed_800hPa'
  /** Wind speed at the 750 hPa pressure level */
  | 'wind_speed_750hPa'
  /** Wind speed at the 700 hPa pressure level */
  | 'wind_speed_700hPa'
  /** Wind speed at the 650 hPa pressure level */
  | 'wind_speed_650hPa'
  /** Wind speed at the 600 hPa pressure level */
  | 'wind_speed_600hPa'
  /** Wind speed at the 550 hPa pressure level */
  | 'wind_speed_550hPa'
  /** Wind speed at the 500 hPa pressure level */
  | 'wind_speed_500hPa'
  /** Wind speed at the 450 hPa pressure level */
  | 'wind_speed_450hPa'
  /** Wind speed at the 400 hPa pressure level */
  | 'wind_speed_400hPa'
  /** Wind speed at the 350 hPa pressure level */
  | 'wind_speed_350hPa'
  /** Wind speed at the 300 hPa pressure level */
  | 'wind_speed_300hPa'
  /** Wind speed at the 275 hPa pressure level */
  | 'wind_speed_275hPa'
  /** Wind speed at the 250 hPa pressure level */
  | 'wind_speed_250hPa'
  /** Wind speed at the 225 hPa pressure level */
  | 'wind_speed_225hPa'
  /** Wind speed at the 200 hPa pressure level */
  | 'wind_speed_200hPa'
  /** Wind speed at the 175 hPa pressure level */
  | 'wind_speed_175hPa'
  /** Wind speed at the 150 hPa pressure level */
  | 'wind_speed_150hPa'
  /** Wind speed at the 125 hPa pressure level */
  | 'wind_speed_125hPa'
  /** Wind speed at the 100 hPa pressure level */
  | 'wind_speed_100hPa'
  /** Wind speed at the 50 hPa pressure level */
  | 'wind_speed_50hPa'
  /** Wind speed at the 10 hPa pressure level */
  | 'wind_speed_10hPa'
  /** Wind direction at the 1000 hPa pressure level in degrees */
  | 'wind_direction_1000hPa'
  /** Wind direction at the 950 hPa pressure level in degrees */
  | 'wind_direction_950hPa'
  /** Wind direction at the 925 hPa pressure level in degrees */
  | 'wind_direction_925hPa'
  /** Wind direction at the 900 hPa pressure level in degrees */
  | 'wind_direction_900hPa'
  /** Wind direction at the 850 hPa pressure level in degrees */
  | 'wind_direction_850hPa'
  /** Wind direction at the 800 hPa pressure level in degrees */
  | 'wind_direction_800hPa'
  /** Wind direction at the 750 hPa pressure level in degrees */
  | 'wind_direction_750hPa'
  /** Wind direction at the 700 hPa pressure level in degrees */
  | 'wind_direction_700hPa'
  /** Wind direction at the 650 hPa pressure level in degrees */
  | 'wind_direction_650hPa'
  /** Wind direction at the 600 hPa pressure level in degrees */
  | 'wind_direction_600hPa'
  /** Wind direction at the 550 hPa pressure level in degrees */
  | 'wind_direction_550hPa'
  /** Wind direction at the 500 hPa pressure level in degrees */
  | 'wind_direction_500hPa'
  /** Wind direction at the 450 hPa pressure level in degrees */
  | 'wind_direction_450hPa'
  /** Wind direction at the 400 hPa pressure level in degrees */
  | 'wind_direction_400hPa'
  /** Wind direction at the 350 hPa pressure level in degrees */
  | 'wind_direction_350hPa'
  /** Wind direction at the 300 hPa pressure level in degrees */
  | 'wind_direction_300hPa'
  /** Wind direction at the 275 hPa pressure level in degrees */
  | 'wind_direction_275hPa'
  /** Wind direction at the 250 hPa pressure level in degrees */
  | 'wind_direction_250hPa'
  /** Wind direction at the 225 hPa pressure level in degrees */
  | 'wind_direction_225hPa'
  /** Wind direction at the 200 hPa pressure level in degrees */
  | 'wind_direction_200hPa'
  /** Wind direction at the 175 hPa pressure level in degrees */
  | 'wind_direction_175hPa'
  /** Wind direction at the 150 hPa pressure level in degrees */
  | 'wind_direction_150hPa'
  /** Wind direction at the 125 hPa pressure level in degrees */
  | 'wind_direction_125hPa'
  /** Wind direction at the 100 hPa pressure level in degrees */
  | 'wind_direction_100hPa'
  /** Wind direction at the 50 hPa pressure level in degrees */
  | 'wind_direction_50hPa'
  /** Wind direction at the 10 hPa pressure level in degrees */
  | 'wind_direction_10hPa'
  /** Vertical wind velocity at the 1000 hPa pressure level */
  | 'vertical_velocity_1000hPa'
  /** Vertical wind velocity at the 950 hPa pressure level */
  | 'vertical_velocity_950hPa'
  /** Vertical wind velocity at the 925 hPa pressure level */
  | 'vertical_velocity_925hPa'
  /** Vertical wind velocity at the 900 hPa pressure level */
  | 'vertical_velocity_900hPa'
  /** Vertical wind velocity at the 850 hPa pressure level */
  | 'vertical_velocity_850hPa'
  /** Vertical wind velocity at the 800 hPa pressure level */
  | 'vertical_velocity_800hPa'
  /** Vertical wind velocity at the 750 hPa pressure level */
  | 'vertical_velocity_750hPa'
  /** Vertical wind velocity at the 700 hPa pressure level */
  | 'vertical_velocity_700hPa'
  /** Vertical wind velocity at the 650 hPa pressure level */
  | 'vertical_velocity_650hPa'
  /** Vertical wind velocity at the 600 hPa pressure level */
  | 'vertical_velocity_600hPa'
  /** Vertical wind velocity at the 550 hPa pressure level */
  | 'vertical_velocity_550hPa'
  /** Vertical wind velocity at the 500 hPa pressure level */
  | 'vertical_velocity_500hPa'
  /** Vertical wind velocity at the 450 hPa pressure level */
  | 'vertical_velocity_450hPa'
  /** Vertical wind velocity at the 400 hPa pressure level */
  | 'vertical_velocity_400hPa'
  /** Vertical wind velocity at the 350 hPa pressure level */
  | 'vertical_velocity_350hPa'
  /** Vertical wind velocity at the 300 hPa pressure level */
  | 'vertical_velocity_300hPa'
  /** Vertical wind velocity at the 275 hPa pressure level */
  | 'vertical_velocity_275hPa'
  /** Vertical wind velocity at the 250 hPa pressure level */
  | 'vertical_velocity_250hPa'
  /** Vertical wind velocity at the 225 hPa pressure level */
  | 'vertical_velocity_225hPa'
  /** Vertical wind velocity at the 200 hPa pressure level */
  | 'vertical_velocity_200hPa'
  /** Vertical wind velocity at the 175 hPa pressure level */
  | 'vertical_velocity_175hPa'
  /** Vertical wind velocity at the 150 hPa pressure level */
  | 'vertical_velocity_150hPa'
  /** Vertical wind velocity at the 125 hPa pressure level */
  | 'vertical_velocity_125hPa'
  /** Vertical wind velocity at the 100 hPa pressure level */
  | 'vertical_velocity_100hPa'
  /** Vertical wind velocity at the 50 hPa pressure level */
  | 'vertical_velocity_50hPa'
  /** Vertical wind velocity at the 10 hPa pressure level */
  | 'vertical_velocity_10hPa'
  /** Geopotential height of the 1000 hPa pressure level in meters */
  | 'geopotential_height_1000hPa'
  /** Geopotential height of the 950 hPa pressure level in meters */
  | 'geopotential_height_950hPa'
  /** Geopotential height of the 925 hPa pressure level in meters */
  | 'geopotential_height_925hPa'
  /** Geopotential height of the 900 hPa pressure level in meters */
  | 'geopotential_height_900hPa'
  /** Geopotential height of the 850 hPa pressure level in meters */
  | 'geopotential_height_850hPa'
  /** Geopotential height of the 800 hPa pressure level in meters */
  | 'geopotential_height_800hPa'
  /** Geopotential height of the 750 hPa pressure level in meters */
  | 'geopotential_height_750hPa'
  /** Geopotential height of the 700 hPa pressure level in meters */
  | 'geopotential_height_700hPa'
  /** Geopotential height of the 650 hPa pressure level in meters */
  | 'geopotential_height_650hPa'
  /** Geopotential height of the 600 hPa pressure level in meters */
  | 'geopotential_height_600hPa'
  /** Geopotential height of the 550 hPa pressure level in meters */
  | 'geopotential_height_550hPa'
  /** Geopotential height of the 500 hPa pressure level in meters */
  | 'geopotential_height_500hPa'
  /** Geopotential height of the 450 hPa pressure level in meters */
  | 'geopotential_height_450hPa'
  /** Geopotential height of the 400 hPa pressure level in meters */
  | 'geopotential_height_400hPa'
  /** Geopotential height of the 350 hPa pressure level in meters */
  | 'geopotential_height_350hPa'
  /** Geopotential height of the 300 hPa pressure level in meters */
  | 'geopotential_height_300hPa'
  /** Geopotential height of the 275 hPa pressure level in meters */
  | 'geopotential_height_275hPa'
  /** Geopotential height of the 250 hPa pressure level in meters */
  | 'geopotential_height_250hPa'
  /** Geopotential height of the 225 hPa pressure level in meters */
  | 'geopotential_height_225hPa'
  /** Geopotential height of the 200 hPa pressure level in meters */
  | 'geopotential_height_200hPa'
  /** Geopotential height of the 175 hPa pressure level in meters */
  | 'geopotential_height_175hPa'
  /** Geopotential height of the 150 hPa pressure level in meters */
  | 'geopotential_height_150hPa'
  /** Geopotential height of the 125 hPa pressure level in meters */
  | 'geopotential_height_125hPa'
  /** Geopotential height of the 100 hPa pressure level in meters */
  | 'geopotential_height_100hPa'
  /** Geopotential height of the 50 hPa pressure level in meters */
  | 'geopotential_height_50hPa'
  /** Geopotential height of the 10 hPa pressure level in meters */
  | 'geopotential_height_10hPa'

/**
 * Daily variables that can be requested from the Open-Meteo Weather Forecast API.
 */
export type DailyWeatherVariables =
  // -------------------------------------------------------------------------
  // Temperature & Apparent Temperature
  // -------------------------------------------------------------------------
  /** Maximum daily air temperature at 2 meters above ground */
  | 'temperature_2m_max'
  /** Minimum daily air temperature at 2 meters above ground */
  | 'temperature_2m_min'
  /** Maximum daily perceived temperature combining wind chill and heat index */
  | 'apparent_temperature_max'
  /** Minimum daily perceived temperature combining wind chill and heat index */
  | 'apparent_temperature_min'

  // -------------------------------------------------------------------------
  // Sun, Daylight & Radiation
  // -------------------------------------------------------------------------
  /** Sunrise time (ISO 8601 format) */
  | 'sunrise'
  /** Sunset time (ISO 8601 format) */
  | 'sunset'
  /** Number of seconds of daylight per day */
  | 'daylight_duration'
  /** Number of seconds of sunshine per day (direct radiation > 120 W/m²) */
  | 'sunshine_duration'
  /** Maximum daily UV Index according to WHO guidelines */
  | 'uv_index_max'
  /** Maximum daily UV Index assuming clear sky conditions */
  | 'uv_index_clear_sky_max'
  /** Sum of daily shortwave solar radiation reaching the horizontal surface */
  | 'shortwave_radiation_sum'

  // -------------------------------------------------------------------------
  // Precipitation, Rain & Snow
  // -------------------------------------------------------------------------
  /** Total daily precipitation (rain, showers, snow) sum in millimeters */
  | 'precipitation_sum'
  /** Total daily rain from large scale weather systems sum in millimeters */
  | 'rain_sum'
  /** Total daily convective showers sum in millimeters */
  | 'showers_sum'
  /** Total daily snowfall sum in centimeters */
  | 'snowfall_sum'
  /** Number of hours with precipitation per day */
  | 'precipitation_hours'
  /** Maximum daily probability of precipitation occurring */
  | 'precipitation_probability_max'

  // -------------------------------------------------------------------------
  // Wind Speed, Gusts & Direction
  // -------------------------------------------------------------------------
  /** Maximum daily wind speed at 10 meters above ground */
  | 'wind_speed_10m_max'
  /** Maximum daily wind gust speed at 10 meters above ground */
  | 'wind_gusts_10m_max'
  /** Daily dominant wind direction at 10 meters above ground in degrees */
  | 'wind_direction_10m_dominant'

  // -------------------------------------------------------------------------
  // Weather Code & Evapotranspiration
  // -------------------------------------------------------------------------
  /** Most severe WMO weather interpretation code of the day */
  | 'weather_code'
  /** Total daily reference evapotranspiration of a well-watered grass field (FAO-56) */
  | 'et0_fao_evapotranspiration'

/**
 * Current weather variables that can be requested from the Open-Meteo Weather Forecast API.
 */
export type CurrentWeatherVariables =
  // -------------------------------------------------------------------------
  // Temperature & Apparent Temperature
  // -------------------------------------------------------------------------
  /** Current air temperature at 2 meters above ground */
  | 'temperature_2m'
  /** Current perceived temperature combining wind chill and heat index at 2 meters */
  | 'apparent_temperature'

  // -------------------------------------------------------------------------
  // Humidity, Clouds & Pressure
  // -------------------------------------------------------------------------
  /** Current relative humidity at 2 meters above ground */
  | 'relative_humidity_2m'
  /** Current total cloud cover as an area fraction (0-100%) */
  | 'cloud_cover'
  /** Current atmospheric pressure at the ground surface */
  | 'surface_pressure'
  /** Current atmospheric air pressure reduced to mean sea level */
  | 'pressure_msl'

  // -------------------------------------------------------------------------
  // Precipitation, Rain & Snow
  // -------------------------------------------------------------------------
  /** Current total precipitation (rain, showers, snow) in millimeters */
  | 'precipitation'
  /** Current rain from large scale weather systems in millimeters */
  | 'rain'
  /** Current showers from convective precipitation in millimeters */
  | 'showers'
  /** Current snowfall amount in centimeters */
  | 'snowfall'

  // -------------------------------------------------------------------------
  // Wind Speed, Gusts & Direction
  // -------------------------------------------------------------------------
  /** Current wind speed at 10 meters above ground */
  | 'wind_speed_10m'
  /** Current wind direction at 10 meters above ground in degrees */
  | 'wind_direction_10m'
  /** Current maximum wind gust speed at 10 meters above ground */
  | 'wind_gusts_10m'

  // -------------------------------------------------------------------------
  // Weather Code & Day/Night Indicator
  // -------------------------------------------------------------------------
  /** Current WMO weather interpretation code (0: Clear, 1-3: Cloudy, etc.) */
  | 'weather_code'
  /** 1 if the current location has daylight, 0 at night */
  | 'is_day'

/**
 * Minutely weather variables that can be requested from the Open-Meteo Weather Forecast API.
 */
export type Minutely15WeatherVariables =
  // -------------------------------------------------------------------------
  // Temperature & Apparent Temperature
  // -------------------------------------------------------------------------
  /** Air temperature at 2 meters above ground */
  | 'temperature_2m'
  /** Perceived temperature combining wind chill and heat index at 2 meters */
  | 'apparent_temperature'
  /** Dew point temperature at 2 meters above ground */
  | 'dew_point_2m'
  /** Altitude above sea level where the temperature drops to 0°C */
  | 'freezing_level_height'

  // -------------------------------------------------------------------------
  // Humidity & Visibility
  // -------------------------------------------------------------------------
  /** Relative humidity at 2 meters above ground */
  | 'relative_humidity_2m'
  /** Horizontal viewing distance in meters */
  | 'visibility'

  // -------------------------------------------------------------------------
  // Precipitation, Rain & Snow
  // -------------------------------------------------------------------------
  /** Total precipitation (rain, showers, snow) of the preceding 15 minutes */
  | 'precipitation'
  /** Rain from large scale weather systems of the preceding 15 minutes */
  | 'rain'
  /** Snowfall amount of the preceding 15 minutes in centimeters */
  | 'snowfall'
  /** Altitude where snowfall begins to accumulate */
  | 'snowfall_height'

  // -------------------------------------------------------------------------
  // Wind Speed, Gusts & Direction
  // -------------------------------------------------------------------------
  /** Wind speed at 10 meters above ground */
  | 'wind_speed_10m'
  /** Wind speed at 20 meters above ground */
  | 'wind_speed_20m'
  /** Wind speed at 50 meters above ground */
  | 'wind_speed_50m'
  /** Wind speed at 80 meters above ground */
  | 'wind_speed_80m'
  /** Wind speed at 100 meters above ground */
  | 'wind_speed_100m'
  /** Wind direction at 10 meters above ground in degrees */
  | 'wind_direction_10m'
  /** Wind direction at 20 meters above ground in degrees */
  | 'wind_direction_20m'
  /** Wind direction at 50 meters above ground in degrees */
  | 'wind_direction_50m'
  /** Wind direction at 80 meters above ground in degrees */
  | 'wind_direction_80m'
  /** Wind direction at 100 meters above ground in degrees */
  | 'wind_direction_100m'
  /** Maximum wind gust speed at 10 meters above ground */
  | 'wind_gusts_10m'

  // -------------------------------------------------------------------------
  // Sun & Daylight
  // -------------------------------------------------------------------------
  /** Number of seconds of sunshine per 15-minute interval (> 120 W/m²) */
  | 'sunshine_duration'
  /** 1 if the current time step has daylight, 0 at night */
  | 'is_day'

  // -------------------------------------------------------------------------
  // Convection, Instability & Weather Code
  // -------------------------------------------------------------------------
  /** WMO Weather interpretation code (0: Clear, 1-3: Cloudy, etc.) */
  | 'weather_code'
  /** Convective Available Potential Energy (CAPE) in Joules per kilogram */
  | 'cape'
  /** Probability or potential index of lightning strikes occurring */
  | 'lightning_potential'

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
