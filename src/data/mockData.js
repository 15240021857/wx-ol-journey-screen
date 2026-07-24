// 池州市景区数据 locationId是根据区县来的
// locationId来源  https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv
export const scenicList = [
  {
    name: '九华秋浦胜境风景区',
    id: '10122170103A',
    lat: '30.36000',
    lon: '117.36000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '69',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '杏花村',
    id: '10122170105A',
    lat: '30.64000',
    lon: '117.47000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '68',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '秀山门博物馆',
    id: '10122170102A',
    lat: '30.65000',
    lon: '117.48000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '68',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '九华漂流景区',
    id: '10122170101A',
    lat: '30.42000',
    lon: '117.63000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '68',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '九华天池风景区',
    id: '10122170104A',
    lat: '30.62000',
    lon: '117.61000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '68',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '蓬莱仙洞',
    id: '10122170501A',
    lat: '30.23000',
    lon: '117.54000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '68',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '历山风景区',
    id: '10122170201A',
    lat: '30.21000',
    lon: '117.00000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '69',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '仙寓山',
    id: '10122170502A',
    lat: '30.06000',
    lon: '117.35000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '68',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '牯牛降',
    id: '10122170503A',
    lat: '30.09000',
    lon: '117.49000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '68',
    fxLink: 'https://www.qweather.com'
  },
  {
    name: '九华山风景区',
    id: '10122170303A',
    lat: '30.48000',
    lon: '117.80000',
    adm2: '池州',
    adm1: '安徽',
    country: '中国',
    tz: 'Asia/Shanghai',
    utcOffset: '+08:00',
    isDst: '0',
    type: 'scenic',
    rank: '68',
    fxLink: 'https://www.qweather.com'
  }
]
// 区县和主要景区
export const districtList = [
  { name: '贵池区', lng: 117.4895, lat: 30.6612, locationId: '101221706', nowWeather: null },
  { name: '东至县', lng: 117.017, lat: 30.102, locationId: '101221702', nowWeather: null },
  { name: '石台县', lng: 117.468, lat: 30.135, locationId: '101221705', nowWeather: null },
  { name: '青阳县', lng: 117.861, lat: 30.624, locationId: '101221703', nowWeather: null },
  { name: '九华山风景区', lng: 117.8, lat: 30.48, locationId: '101221703', nowWeather: null }
]

export const weatherData = [
  {
    name: '贵池区',
    weather: 'sunny',
    temperature: 28,
    humidity: 65,
    wind: '东南风3级',
    warning: null,
    details: '今日晴转多云，气温23-31°C，适宜出行'
  },
  {
    name: '东至县',
    weather: 'rainy',
    temperature: 25,
    humidity: 85,
    wind: '东北风4级',
    warning: null,
    details: '今日小雨转中雨，气温22-27°C，注意携带雨具'
  },
  {
    name: '石台县',
    weather: 'sunny',
    temperature: 26,
    humidity: 70,
    wind: '南风2级',
    warning: null,
    details: '今日晴天，气温21-29°C，空气质量优'
  },
  {
    name: '青阳县',
    weather: 'rainy',
    temperature: 24,
    humidity: 88,
    wind: '东风5级',
    warning: 'storm',
    details: '今日有大暴雨，气温20-25°C，橙色预警，请避免外出'
  },
  {
    name: '九华山风景区',
    weather: 'sunny',
    temperature: 22,
    humidity: 60,
    wind: '西北风3级',
    warning: null,
    details: '今日晴天，气温18-26°C，适合登山游览'
  }
]

export const scenicData = [
  { name: '九华山风景区', visitors: 12580, capacity: 15000 },
  { name: '杏花村', visitors: 3200, capacity: 5000 },
  { name: '石台牯牛降', visitors: 2850, capacity: 4000 },
  { name: '蓬莱仙洞', visitors: 1890, capacity: 3000 },
  { name: '大王洞', visitors: 1560, capacity: 2500 },
  { name: '平天湖', visitors: 2100, capacity: 3500 }
]

export const populationData = [
  { name: '贵池区', population: 67.5, area: 2516 },
  { name: '东至县', population: 49.2, area: 3256 },
  { name: '石台县', population: 9.5, area: 1403 },
  { name: '青阳县', population: 28.9, area: 1181 }
]

export const visitorTrendData = {
  days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  visitors: [45000, 48000, 52000, 49000, 55000, 89000, 92000]
}

export const weatherIconMap = {
  sunny: '☀️',
  rainy: '🌧️',
  cloudy: '☁️',
  storm: '⛈️',
  typhoon: '🌀'
}

export const warningLevelMap = {
  typhoon: { level: '红色预警', color: '#ff4d4f', icon: '🌀' },
  storm: { level: '橙色预警', color: '#fa8c16', icon: '⛈️' }
}
