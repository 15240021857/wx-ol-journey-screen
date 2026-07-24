import { getAirquality, getDaysWeather, getNowWeather, getWarning } from '@/api/weather'
import { AirqualityProps, DaysWeatherProps, WarningProps } from '@/type/weather'
import { storage } from '@/util/storage'
import { defineStore } from 'pinia'
import { ref } from 'vue'
interface NowWeatherValue {
  data: any
  exprieAt: number
}
interface DaysWeatherValue {
  data: DaysWeatherProps[]
  exprieAt: number
}
interface AirqualityValue {
  data: AirqualityProps
  exprieAt: number
}
interface WarningValue {
  data: WarningProps
  exprieAt: number
}

const WEATHER_CACHE_KEY = 'weather_cache'
const DAYS_WEATHER_CACHE_KEY = 'days_weather_cache'
const AIR_CACHE_KEY = 'air_cache'
const WARNING_CACHE_KEY = 'warning_cache'

// const nowWeatherTTL = 3 * 60 * 60 * 1000
// const airqualityTTL = 10 * 60 * 60 * 60 * 1000
// const warningTTL = 6 * 60 * 60 * 60 * 1000
const nowWeatherTTL = 6 * 60 * 60 * 1000
const airqualityTTL = 24 * 60 * 60 * 60 * 1000
const warningTTL = 24 * 60 * 60 * 60 * 1000
const daysWeatherDaysTTL = 12 * 60 * 60 * 60 * 1000

export const useWeatherStore = defineStore('weather', () => {
  const localWeather = storage.local.get(WEATHER_CACHE_KEY) || {}
  const localDaysWeather = storage.local.get(DAYS_WEATHER_CACHE_KEY) || {}
  const localAir = storage.local.get(AIR_CACHE_KEY) || {}
  const localWarning = storage.local.get(WARNING_CACHE_KEY) || {}
  // 实时天气
  const nowWeatherMap = ref<Record<string, NowWeatherValue>>(localWeather)
  // 空气质量
  const airqualityMap = ref<Record<string, AirqualityValue>>(localAir)
  // 预警
  const warningMap = ref<Record<string, WarningValue>>(localWarning)
  // 每日天气
  const daysWeatherMap = ref<Record<string, DaysWeatherValue>>(localDaysWeather)
  /**
   * 获取当前天气
   * @param location locationId
   * @param ttl 缓存多久 ms
   * @returns 当前天气
   */
  const getNowWeatherFun = async (location: string | (number | string)[], ttl = nowWeatherTTL) => {
    const locationStr = Array.isArray(location) ? location.join(',') : location
    const cacheNow = nowWeatherMap.value[locationStr]
    if (cacheNow && cacheNow.exprieAt > Date.now()) {
      // 缓存未过期 直接返回
      // console.log('缓存未过期 直接返回')
      // console.log(cacheNow)
      return cacheNow.data
    }

    const res: any = await getNowWeather({ location: locationStr })
    nowWeatherMap.value[locationStr] = {
      data: res.now,
      exprieAt: Date.now() + ttl
    }
    storage.local.set(WEATHER_CACHE_KEY, nowWeatherMap.value)
    console.log('缓存更新')
    console.log(res.now)
    return res.now
  }
  // 获取空气质量
  const getAirqualityFun = async (location: (number | string)[], ttl = airqualityTTL) => {
    const locationStr = location.join(',')
    const cacheAirquality = airqualityMap.value[locationStr]
    if (cacheAirquality && cacheAirquality.exprieAt > Date.now()) {
      // 缓存未过期 直接返回
      // console.log('缓存未过期 直接返回')
      // console.log(cacheAirquality)
      return cacheAirquality.data
    }
    const res: any = await getAirquality({ location })
    console.log('空气质量', res)
    const pm2p5Data = res?.pollutants?.find((item: any) => item.code === 'pm2p5')
    const data: AirqualityProps = {
      ...res.indexes[0],
      primaryPollutant: {
        code: pm2p5Data?.code,
        name: pm2p5Data?.name,
        value: pm2p5Data?.concentration?.value,
        unit: pm2p5Data?.concentration?.unit,
        fullName: pm2p5Data?.fullName
      }
    }
    airqualityMap.value[locationStr] = {
      data,
      exprieAt: Date.now() + ttl
    }
    storage.local.set(AIR_CACHE_KEY, airqualityMap.value)
    return data
  }
  // 获取每日天气
  const getDaysWeatherFun = async (
    location: string | (number | string)[],
    ttl = daysWeatherDaysTTL
  ) => {
    const locationStr = Array.isArray(location) ? location.join(',') : location
    const cacheDaysWeather = daysWeatherMap.value[locationStr]
    if (cacheDaysWeather && cacheDaysWeather.exprieAt > Date.now()) {
      // 缓存未过期 直接返回
      // console.log('缓存未过期 直接返回')
      // console.log(cacheDaysWeather)
      return cacheDaysWeather.data
    }
    const res: any = await getDaysWeather({ location: locationStr, days: '7d' })
    const data: DaysWeatherProps[] = res.daily || []
    daysWeatherMap.value[locationStr] = {
      data,
      exprieAt: Date.now() + ttl
    }
    storage.local.set(DAYS_WEATHER_CACHE_KEY, daysWeatherMap.value)
    console.log(`每日天气 缓存更新`)
    console.log(data)
    return data
  }
  // 获取预警
  const getWarningFun = async (
    location: (number | string)[],
    ttl = warningTTL
  ): Promise<WarningProps> => {
    const locationStr = location.join(',')
    const cacheWarning = warningMap.value[locationStr]
    if (cacheWarning && cacheWarning.exprieAt > Date.now()) {
      // 缓存未过期 直接返回
      // console.log('缓存未过期 直接返回')
      // console.log(cacheWarning)
      return cacheWarning.data
    }
    const res: any = await getWarning({ location })
    console.log('预警', res)
    const alertsData: WarningProps =
      res?.alerts?.map((item: any) => {
        return {
          ...item,
          eventName: item.eventType?.name,
          eventCode: item.eventType?.code
        }
      }) || []
    warningMap.value[locationStr] = {
      data: alertsData,
      exprieAt: Date.now() + ttl
    }
    storage.local.set(WARNING_CACHE_KEY, warningMap.value)
    return alertsData
  }

  return { nowWeatherMap, getNowWeatherFun, getAirqualityFun, getWarningFun, getDaysWeatherFun }
})
