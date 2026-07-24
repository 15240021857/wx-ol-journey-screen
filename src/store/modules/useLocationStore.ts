import { getCityLocation, getPOIRange } from '@/api/weather'
import { storage } from '@/util/storage'
import { defineStore } from 'pinia'
import { ref } from 'vue'
// @ts-ignore
import { chizhouBoundary } from '@/data/chizhouBoundary'

interface ScenicPOI {
  data: any
  expireAt: number
}
interface LocationProps {
  adcode: number
  name: string
  center: number[] // [lon, lat]政务中心
  centroid: number[] // 地理中心
  childrenNum: number
  level: 'city'
  acroutes: number[]
  parent: { adcode: number }
}
const POI_CACHE_KEY = 'poi_cache'
const poiTTL = 30 * 24 * 60 * 60 * 1000 // 30天过期
export const useLocationStore = defineStore('locationStore', () => {
  // 从缓存中获取POI
  const poiCache = storage.local.get(POI_CACHE_KEY) || {}
  const scenicPOIMap = ref<Record<string, ScenicPOI>>(poiCache)
  const curLocation = ref<LocationProps | null>(null)
  //   当前城市locationId 池州
  const curLocationId = '101221701'
  //   青阳
  //   const curLocationId = '101221703'
  // 获取当前城市属性，以后会动态更改， 让地图中心也动态切换
  const getLocationFun = async () => {
    // 暂时从静态数据中获取
    const properties = chizhouBoundary.features?.[0].properties || {}
    curLocation.value = properties || {}
    return curLocation.value || null
  }
  // 获取城市的locationId
  const getLocationIdFun = async (location?: string | number[]) => {
    const curLocationStorage = storage.local.get('curLocation') || null
    if (curLocationStorage?.data && curLocationStorage.expireAt > Date.now()) {
      // 已有缓存
      curLocation.value = curLocationStorage.data
      return curLocation.value
    }
    const res: any = await getCityLocation({
      location: location || curLocationId,
      range: 'cn',
      adm: 'anhui',
      number: 10
    })
    console.log('res==getCityLocation', res)
    curLocation.value = res.location?.[0] || null
    storage.local.set('curLocation', {
      data: curLocation.value,
      expireAt: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
    })
  }
  const getPOIFun = async (
    params: {
      location?: string
      radius?: number
      type?: string
      number?: number
    },
    ttl = poiTTL
  ) => {
    const [lon, lat] = curLocation.value?.center || []
    const locationStr = params.location || `${(+lon).toFixed(2)},${(+lat).toFixed(2)}`
    const cachePOI = scenicPOIMap.value[locationStr]
    if (cachePOI && cachePOI.expireAt > Date.now()) {
      // 已有缓存
      return cachePOI.data
    }
    const res: any = await getPOIRange({
      location: locationStr,
      radius: params.radius || 50,
      type: params.type || 'scenic',
      number: params.number || 20
    })
    scenicPOIMap.value[locationStr] = {
      data: res?.poi || [],
      expireAt: Date.now() + ttl
    }
    storage.local.set(POI_CACHE_KEY, scenicPOIMap.value)
    return res?.poi || []
    // console.log('res==POI', res)
  }
  return {
    curLocation,
    getLocationFun,
    getLocationIdFun,
    getPOIFun
  }
})
