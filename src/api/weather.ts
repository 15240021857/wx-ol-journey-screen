import request from '@/util/request'

// 获取城市的locationId
export function getCityLocation(params: {
  location: string | (number | string)[]
  range: string
  adm: string
  lang?: string
  number: number
}) {
  return request({
    url: '/geo/v2/city/lookup',
    method: 'get',
    params: {
      location: params.location,
      lang: params.lang || 'zh',
      // 默认国内
      range: params.range || 'cn',
      adm: params.adm || '',
      number: params.number || 10,
      key: import.meta.env.VITE_WEATHER_KEY
    }
  })
}
// 获取城市的POI信息/
export function getPOI(params: {
  location: string | number[]
  city: string
  // POI类型:如 scenic 景点，TSTA 潮汐站点
  type: string
  lang?: string
  number: number
}) {
  return request({
    url: '/geo/v2/poi/lookup',
    method: 'get',
    params: {
      location: params.location,
      lang: params.lang || 'zh',
      city: params.city || params.location || '',
      type: params.type || 'scenic',
      number: params.number || 10,
      key: import.meta.env.VITE_WEATHER_KEY
    }
  })
}
// 获取城市的POI信息/
export function getPOIRange(params: {
  location: string | number[]
  radius: number
  // POI类型:如 scenic 景点，TSTA 潮汐站点
  type: string
  lang?: string
  number: number
}) {
  return request({
    url: '/geo/v2/poi/range',
    method: 'get',
    params: {
      location: params.location,
      // lang: params.lang || 'zh',
      radius: params.radius || 5,
      type: params.type || 'scenic',
      number: params.number || 20,
      key: import.meta.env.VITE_WEATHER_KEY
    }
  })
}

// 获取实时天气
export function getNowWeather(params: { location: string | (number | string)[]; lang?: string }) {
  return request({
    url: '/v7/weather/now',
    method: 'get',
    params: {
      ...params,
      lang: params.lang || 'zh',
      key: import.meta.env.VITE_WEATHER_KEY
    }
  })
}
// 获取每日天气 3-30天 通过LocationID|经纬度获取
export function getDaysWeather(params: {
  days: '3d' | '7d' | '10d' | '15d' | '30d'
  location: string | (number | string)[]
  lang?: string
}) {
  return request({
    url: `/v7/weather/${params.days || '3d'}`,
    method: 'get',
    params: {
      location: params.location,
      lang: params.lang || 'zh',
      key: import.meta.env.VITE_WEATHER_KEY
    }
  })
}

/**
 * 获取天气生活指数 1d,3d
 * type: 3,4
 * 0:全部指数
 * 3:穿衣指数
 * 4:钓鱼指数
 * 5:紫外线指数
 * 6:旅游指数
 * 7:花粉过敏
 * 8:舒适度指数
 * 9：感冒指数
 * 12：太阳镜指数
 * 15：交通指数
 * 16：防晒指数
 * */
export function getIndices(params: {
  location: string | number[]
  days?: string
  type?: string
  lang?: string
}) {
  return request({
    url: `/v7/indices/${params.days || '1d'}`,
    method: 'get',
    params: {
      type: params.type || '0',
      location: params.location,
      lang: params.lang || 'zh',
      key: import.meta.env.VITE_WEATHER_KEY
    }
  })
}
// 获取预警 latitude, longitude需要gcj-02坐标
export function getWarning(params: {
  location: (number | string)[]
  lang?: string
  localTime?: boolean
}) {
  const [longitude, latitude] = params.location
  return request({
    url: `/weatheralert/v1/current/${latitude}/${longitude}`,
    method: 'get',
    params: {
      localTime: params.localTime || false,
      lang: params.lang || 'zh',
      key: import.meta.env.VITE_WEATHER_KEY
    }
  })
}

// 获取空气质量 latitude, longitude需要gcj-02坐标
export function getAirquality(params: { location: (number | string)[]; lang?: string }) {
  const [longitude, latitude] = params.location
  return request({
    url: `/airquality/v1/current/${latitude}/${longitude}`,
    method: 'get',
    params: {
      lang: params.lang || 'zh',
      key: import.meta.env.VITE_WEATHER_KEY
    }
  })
}
