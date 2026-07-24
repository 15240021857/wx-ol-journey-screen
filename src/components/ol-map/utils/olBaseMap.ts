import { Feature, Map, View } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
import TileSource from 'ol/source/Tile'
import { LayerType } from './olLayerManage'
import { OlLayerManage } from './olLayerManage'
import { OlUtil } from './olUtil'
import { Point } from 'ol/geom'
import { OlStyleFactory } from './olStyleManage'
import { OlHoverSelect } from './olHoverSelect'
import { OlMapEvent } from './olEvent'
import { OlOverlayManage } from './olOverlayManage'

interface MapOptions {
  center: number[]
  zoom: number
  minZoom: number
  maxZoom: number
}
type TileLayerType = 'img_w' | 'cia_w'
export type FeatureType = 'district' | 'city' | 'province'

export class OlBaseMap {
  public map: Map | null = null
  public view: View | null = null
  public layerManage: OlLayerManage | null = null
  public hoverSelect: OlHoverSelect | null = null
  public mapEvent: OlMapEvent | null = null
  public overlayManage: OlOverlayManage | null = null

  constructor() {
    console.log('实例创建完成')
  }
  init(mapContainer: HTMLElement | string, mapOptions: MapOptions) {
    const { center = [120, 30], zoom = 10, minZoom = 3, maxZoom = 18 } = mapOptions
    this.view = new View({
      center: OlUtil.wgs84ToEpsg3857(center),
      zoom,
      rotation: 0
      //   minZoom,
      //   maxZoom
    })
    const baseTileLayer = this.getBaseTileLayer('img_w')
    const baseTextTileLayer = this.getBaseTileLayer('cia_w')
    this.map = new Map({
      target: mapContainer,
      view: this.view,
      layers: [baseTileLayer!, baseTextTileLayer!]
      //   controls: [],
      //   interactions: []
    })
    this.layerManage = new OlLayerManage(this.map) // 图层管理
    this.hoverSelect = new OlHoverSelect(this.map) // 鼠标hover交互
    this.mapEvent = new OlMapEvent(this.map) // 地图事件
    // this.mapEvent.onMapClick(({ lnglat, coordinate, hitFeature }) => {
    //   console.log(lnglat, coordinate, hitFeature)
    // })
    this.overlayManage = new OlOverlayManage(this.map) // overlay管理
  }
  // 获取基础瓦片地图 天地图/高德地图/mapbox

  getBaseTileLayer(layerType: TileLayerType = 'img_w'): TileLayer<TileSource> | null {
    const MAP_KEY = {
      tianditu: 'f79a2d19acf87bce7e13f823cbdec588',
      amap: ''
      //   amap: '2b145a807c97e58770a8aaac717ed500',
      //   tianditu: ''
    }
    const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
    let curSource: TileSource | null = null
    if (MAP_KEY.tianditu) {
      // 天地图
      curSource = new XYZ({
        tileSize: 256,
        crossOrigin: 'anonymous',
        tileUrlFunction: tileCoord => {
          if (!tileCoord) return undefined
          const z = tileCoord[0]
          const x = tileCoord[1]
          const y = tileCoord[2]
          const s = subdomains[Math.abs(x + y) % subdomains.length]
          return `https://t${s}.tianditu.gov.cn/DataServer?T=${layerType}&x=${x}&y=${y}&l=${z}&tk=${MAP_KEY.tianditu}`
        }
      })
    } else if (MAP_KEY.amap) {
      // 高德地图
      curSource = new XYZ({
        tileSize: 256,
        crossOrigin: 'anonymous',
        tileUrlFunction: tileCoord => {
          if (!tileCoord) return undefined
          const z = tileCoord[0]
          const x = tileCoord[1]
          const y = tileCoord[2]
          const s = subdomains[Math.abs(x + y) % subdomains.length]
          return `https://t${s}.amap.com/tiles/2/{z}/{x}/{y}?key=${MAP_KEY.amap}`
        }
      })
    } else {
      console.log('未配置基础瓦片地图')
    }
    if (curSource) {
      return new TileLayer({
        source: curSource
      })
    } else {
      return null
    }
  }
  // 添加图层
  addGeojsonLayer(layerGeoJson: any, layerType: LayerType, featureType: FeatureType) {
    if (layerType === 'region') {
      this.addRegionLayer(layerGeoJson, featureType)
      this.hoverSelect?.addPolygonSelect([this.layerManage?.regionLayer!]) // 给多边形layer添加鼠标hover交互
      return
    }
  }
  //   添加区县geojson图层
  addRegionLayer(layerGeoJson: any, featureType: FeatureType) {
    if (!this.layerManage) return
    // gcj02转成wgs84
    const curJson = JSON.parse(JSON.stringify(layerGeoJson))
    curJson.features?.forEach((feature: any, index: number) => {
      // if (!feature.geometry) {
      //   console.warn(`第 ${index} 个 feature 无 geometry，已跳过`, feature)
      //   feature.geometry = null
      //   return
      // }
      const newGeometry = OlUtil.gcj02ToWgs84Geometry(feature.geometry)
      feature.geometry = newGeometry
      //   feature.set('featureType', 'district')
      feature.properties = {
        ...feature.properties,
        featureType
      }
      // console.log('feature.properties==', feature.properties)
    })

    // 获取feature对象 - 从dataV拿过来的geojson 是gcj02的需要先转成wgs84，再交给ol处理
    const features = new GeoJSON().readFeatures(curJson, {
      dataProjection: 'EPSG:4326', // wgs84 经纬度
      featureProjection: 'EPSG:3857' // epsg3857 坐标
    })
    // 添加到地区图层
    // this.layerManage.regionSource?.clear()
    this.layerManage.regionSource?.addFeatures(features)
  }

  // 新增景点列表
  addScenicMarkerList(scenicList: any[]) {
    scenicList.forEach(scenic => {
      const { lon, lat, level, locationId, name, id, nowWeather, warning, airquality, adm1, adm2 } =
        scenic
      this.layerManage?.addScenicMarker(lon, lat, {
        adm1,
        adm2,
        lon,
        lat,
        level,
        locationId,
        name,
        id, // 唯一标识
        nowWeather,
        warning,
        airquality
      })
    })
    this.hoverSelect?.addMarkerSelect([this.layerManage?.markerLayer!]) // 给点layer添加鼠标hover交互
  }
  // 更新景点列表-style和feature属性
  updateScenicMarkerList(scenicList: any[]) {
    scenicList.forEach(scenic => {
      const { lon, lat, level, locationId, name, id, nowWeather, warning, airquality, adm1, adm2 } =
        scenic
      this.layerManage?.updateScenicMarker(id, {
        adm1,
        adm2,
        lon,
        lat,
        level,
        locationId,
        name,
        id, // 唯一标识
        nowWeather,
        warning,
        airquality
      })
    })
  }
  destroy() {
    this.map?.setTarget(undefined)
    this.map = null
    this.view = null
    this.layerManage?.destroy()
    this.hoverSelect?.destroy()
    this.mapEvent?.destroy()
  }
}

export const createOlBaseMap = () => new OlBaseMap()
