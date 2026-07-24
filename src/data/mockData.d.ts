export interface ScenicItemMocl {
  id: string
  name: string
  weather: string
  lng: number
  lat: number
  level: string
  district: string
  locationId: string
  nowWeather?: any
}
// 和风IPO景点属性
export interface ScenicItem {
  adm1: string
  adm2: string
  country: string
  // fxLink: 'https://www.qweather.com'
  id: string
  isDst: string
  lat: string
  lon: string
  name: string
  rank: string
  type: string
  tz: string
  utcOffset: string
  nowWeather?: any
  airquality?: any
  warning?: any
}

export interface WeatherDataItem {
  name: string
  weather: string
  temperature: number
  humidity: number
  wind: string
  warning: string | null
  details: string
}

export interface ScenicDataItem {
  name: string
  visitors: number
  capacity: number
}

export interface PopulationDataItem {
  name: string
  population: number
  area: number
}

export interface VisitorTrendData {
  days: string[]
  visitors: number[]
}

export interface WeatherIconMap {
  sunny: string
  rainy: string
  cloudy: string
  storm: string
  typhoon: string
}

export interface WarningLevelMapItem {
  level: string
  color: string
  icon: string
}

export interface WarningLevelMap {
  typhoon: WarningLevelMapItem
  storm: WarningLevelMapItem
}

export const scenicList: ScenicItem[]
export const weatherData: WeatherDataItem[]
export const scenicData: ScenicDataItem[]
export const populationData: PopulationDataItem[]
export const visitorTrendData: VisitorTrendData
export const weatherIconMap: WeatherIconMap
export const warningLevelMap: WarningLevelMap
export const districtItem: {
  name: string
  locationId: string
  nowWeather?: any
  lng: number
  lat: number
}
export const districtList: districtItem[]
