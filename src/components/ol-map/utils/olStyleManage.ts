import { Feature } from 'ol'
import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style'
import { getYrIcon, getIconColor } from './hefeng-weather-icon'
import { FeatureLike } from 'ol/Feature'

// 处理图层样式，包括点、线、多边线，最好能缓存，避免重复创建
export class OlStyleFactory {
  //   市
  static getCityStyleDefault() {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.5)'
      }),
      stroke: new Stroke({
        color: 'red',
        width: 2
      })
    })
  }
  //   区县
  static getPolygonStyleDefault(feature: FeatureLike, isHover = false) {
    const featureType = feature.get('featureType')
    const name = feature.get('name')
    const level = feature.get('level')
    if (featureType === 'city') {
      const fillOpacity = isHover ? 0.72 : 0.14
      return [
        new Style({
          fill: new Fill({
            color: `rgba(0, 180, 255, ${fillOpacity})`
          }),
          stroke: new Stroke({
            color: 'rgba(0, 255, 255, 1)',
            width: 5
          })
        })
      ]
    }
    if (featureType === 'district' || featureType === 'region') {
      const fillOpacity = isHover ? 0.62 : 0.24
      return new Style({
        fill: new Fill({
          color: `rgba(0, 180, 255, ${fillOpacity})`
        }),
        stroke: new Stroke({
          color: isHover ? 'rgba(255, 255, 0, 0.85)' : 'rgba(0, 255, 255, 0.55)',
          width: 3,
          lineDash: [5, 10]
        }),
        text: new Text({
          text: name,
          font: `16px "微软雅黑"`,
          offsetY: 0,
          fill: new Fill({
            color: 'white'
          }),
          stroke: new Stroke({
            color: 'black',
            width: 2
          })
        })
      })
    }
    return undefined
  }
  //   景点
  static getScenicStyleDefault(feature: FeatureLike, isHover = false) {
    const data = feature.get('data')
    if (!data) {
      return undefined
    }
    const { nowWeather, level, name, warning } = data
    const levelMap = {
      '5A': 'rgba(255, 0, 255, 0.65)',
      '4A': 'rgba(243, 89, 17, 0.93)',
      other: 'rgba(243, 89, 17, 1)'
    }
    const fontSize = level === '5A' ? '18px' : '18px'
    const curScenicStyleList = [
      new Style({
        text: new Text({
          text: name,
          font: `${fontSize} "微软雅黑"`,
          fill: new Fill({
            color: levelMap[level as keyof typeof levelMap] || levelMap.other
          }),
          offsetY: 20,
          stroke: new Stroke({
            color: 'white',
            width: 2
          })
        })
      })
    ]
    // 天气图标
    const yrIcon = getYrIcon(nowWeather?.icon || '100')
    const curWeatherIcon = new Style({
      image: new Icon({
        src: yrIcon,
        anchor: [0.5, 0.7],
        scale: 0.4,
        crossOrigin: 'anonymous'
      })
    })

    curScenicStyleList.push(curWeatherIcon)
    // 预警图标
    const warningEventName = warning?.[0]?.eventName || ''
    const BASE_URL = import.meta.env.BASE_URL
    if (warningEventName) {
      const warningIconStyle = new Style({
        image: new Icon({
          src: `${BASE_URL}/icons/weather/warn-icon.png`,
          anchor: [-0.45, 1.5],
          scale: 0.26,
          crossOrigin: 'anonymous'
        })
      })
      curScenicStyleList.push(warningIconStyle)
    }

    return curScenicStyleList
  }
  //   天气
  static createWeatherStyle() {
    const weatherMap = {
      sunny: '☀️',
      rainy: '🌧️',
      cloudy: '☁️',
      storm: '⛈️',
      typhoon: '🌀'
    }
    return new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.5)'
      }),
      stroke: new Stroke({
        color: 'blue',
        width: 2
      })
    })
  }
}
