export interface NowWeatherProps {
  cloud: string
  dew: string
  feelsLike: string
  humidity: string
  icon: string
  obsTime: string
  precip: string
  pressure: string
  temp: string
  text: string
  vis: string
  wind360: string
  windDir: string
  windScale: string
  windSpeed: string
}
export interface ScenicDataItem {
  adm1?: string
  adm2?: string
  name?: string
  level?: string
  nowWeather?: NowWeatherProps
  airquality?: AirqualityProps
  warning: WarningProps
  id?: string
}
export interface regionWarningProps {
  name: string
  warning: WarningProps
}

export interface CityLocationProps {
  location: string | number[]
  adm: string
  name: string
  nowWeather: NowWeatherProps
}
// 空气质量props
export interface AirqualityProps {
  code: string
  name: string
  aqi: string
  aqiDisplay: string
  level: string
  category: string
  color: {
    red: number
    green: number
    blue: number
    alpha: number
  }
  primaryPollutant: PrimaryPollutant
  health: {
    effect: string
    advice: {
      generalPopulation: string
      sensitivePopulation: string
    }
  }
}
interface PrimaryPollutant {
  code: string
  name: string
  value: string
  unit: string
  fullName: string
}

export type WarningProps = WarningItem[]
export interface WarningItem {
  id: string
  senderName: string
  issuedTime: string
  messageType: {
    code: string
    supersedes: string[]
  }
  urgency: null
  severity: 'minor'
  certainty: null
  eventName: string
  eventCode: string
  icon: string
  color: {
    code: 'blue'
    red: 30
    green: 50
    blue: 205
    alpha: 1
  }
  effectiveTime: string
  onsetTime: string
  expireTime: string
  headline: string
  description: string
  criteria: string
  instruction: string
}

export interface WarningTableItem {
  scenicId: string
  name: string
  eventName: string
  headline: string
  description: string
  effectiveTime: string
  icon: string
}
// 空气质量等级枚举
// 0 ~ 50	(1) 优	(0,228,0)
// 51 ~ 100	(2) 良	(255,255,0)
// 101 ~ 150	(3) 轻度污染	(255,126,0)
// 151 ~ 200	(4) 中度污染	(255,0,0)
// 201 ~ 300	(5) 重度污染	(153,0,76)
// 301 ~ 500	(6) 严重污染	(126,0,35)
export enum AirQualityLevel {
  Good = '优',
  Fair = '良',
  Unhealthy = '轻度污染',
  VeryUnhealthy = '中度污染',
  Hazardous = '重度污染',
  Extreme = '严重污染'
}
// 最弱(1)、弱(2)、中等(3)、强(4)、很强(5)
export enum UvIndexLevel {
  '1' = '最弱',
  '2' = '弱',
  '3' = '中等',
  '4' = '强',
  '5' = '很强'
}

export interface DaysWeatherProps {
  fxDate: string
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
  moonPhase: string
  moonPhaseIcon: string
  tempMax: string
  tempMin: string
  iconDay: string
  textDay: string
  iconNight: string
  textNight: string
  wind360Day: string
  windDirDay: string
  windScaleDay: string
  windSpeedDay: string
  wind360Night: string
  windDirNight: string
  windScaleNight: string
  windSpeedNight: string
  humidity: string
  precip: string
  pressure: string
  vis: string
  cloud: string
  uvIndex: string
}
export interface RegionTreeItem {
  name: string
  parent: string | null
  treeName: string // 跟geojson中的name对应
  treeID: string
  children?: RegionTreeItem[]
}
// 当前区域
export interface CurRegion {
  adcode: string
  name: string
  center: (number | string)[]
  centroid: (number | string)[]
  level: string
}
// 区域子区域项，用来获取子区域天气数据
export interface regionChildItem {
  adcode: string
  name: string
  center: (number | string)[]
  centroid: (number | string)[]
  level: string
  nowWeather?: NowWeatherProps
  warning?: WarningProps
  airquality?: AirqualityProps
}
