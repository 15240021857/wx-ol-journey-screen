import { Feature, Map } from 'ol'
import { Geometry, Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { OlStyleFactory } from './olStyleManage'
import { OlUtil } from './olUtil'
import { FeatureLike } from 'ol/Feature'

export type LayerType = 'marker' | 'line' | 'polygon' | 'region'

export class OlLayerManage {
  private map: Map
  // 点图层
  public markerSource: VectorSource | null = null
  public markerLayer: VectorLayer<Feature<Geometry>> | null = null
  // 线图层
  public lineSource: VectorSource | null = null
  public lineLayer: VectorLayer<Feature<Geometry>> | null = null
  // 多边线图层
  public polygonSource: VectorSource | null = null
  public polygonLayer: VectorLayer<Feature<Geometry>> | null = null
  // 地区图层
  public regionSource: VectorSource | null = null
  public regionLayer: VectorLayer<Feature<Geometry>> | null = null

  constructor(map: Map) {
    this.map = map

    this.markerSource = new VectorSource()
    this.markerLayer = new VectorLayer({
      source: this.markerSource,
      zIndex: 10
    })

    this.lineSource = new VectorSource()
    this.lineLayer = new VectorLayer({
      source: this.lineSource,
      zIndex: 5
    })

    this.polygonSource = new VectorSource()
    this.polygonLayer = new VectorLayer({
      source: this.polygonSource,
      zIndex: 3,
      style: (feature: FeatureLike) => {
        return OlStyleFactory.getPolygonStyleDefault(feature)
      }
    })
    this.regionSource = new VectorSource()
    this.regionLayer = new VectorLayer({
      source: this.regionSource,
      zIndex: 2,
      style: (feature: FeatureLike) => {
        return OlStyleFactory.getPolygonStyleDefault(feature)
      }
    })

    const layers = [this.markerLayer, this.lineLayer, this.polygonLayer, this.regionLayer]
    for (const layer of layers) {
      if (layer) {
        this.map?.addLayer(layer)
      }
    }
  }
  addMarker(feature: Feature<Geometry>) {
    this.markerSource?.addFeature(feature)
  }
  addLine(feature: Feature<Geometry>) {
    this.lineSource?.addFeature(feature)
  }
  addPolygon(feature: Feature<Geometry>) {
    this.polygonSource?.addFeature(feature)
  }
  // 设置图层可见性
  setVisible(layerType: LayerType, visible: boolean) {
    const layerMap = {
      marker: this.markerLayer,
      line: this.lineLayer,
      polygon: this.polygonLayer,
      region: this.regionLayer
    }
    layerMap[layerType]?.setVisible(visible)
  }
  //   清空图层数据
  clear(layerType: LayerType) {
    const sourceMap = {
      marker: this.markerSource,
      line: this.lineSource,
      polygon: this.polygonSource,
      region: this.regionSource
    }
    sourceMap[layerType]?.clear()
  }
  // 清空所有图层数据
  destroy() {
    if (!this.map) return
    this.clear('marker')
    this.clear('line')
    this.clear('polygon')
    this.markerSource = null
    this.lineSource = null
    this.polygonSource = null

    if (this.markerLayer) {
      this.map.removeLayer(this.markerLayer)
      this.markerLayer = null
    }
    if (this.lineLayer) {
      this.map.removeLayer(this.lineLayer)
      this.lineLayer = null
    }
    if (this.polygonLayer) {
      this.map.removeLayer(this.polygonLayer)
      this.polygonLayer = null
    }
    if (this.regionLayer) {
      this.map.removeLayer(this.regionLayer)
      this.regionLayer = null
    }
  }
  //   添加景点点
  addScenicMarker(lon: number, lat: number, attrs: Record<string, any> = {}) {
    // const { lng, lat, level, locationId, name } = scenic
    const currentFeature = this.markerSource?.getFeatureById(attrs.id)
    if (currentFeature) {
      console.log('重复添加ScenicMarker', attrs.id, attrs.name)
      return currentFeature
    }
    const wgs84 = OlUtil.gcj02ToWgs84([lon, lat])
    const feature = new Feature({
      geometry: new Point(OlUtil.wgs84ToEpsg3857(wgs84)),
      data: attrs
      // ...attrs
    })
    // console.log(feature)

    feature.set('featureType', 'marker')
    feature.setId(attrs.id)
    feature.setStyle(OlStyleFactory.getScenicStyleDefault(feature))
    this.markerSource?.addFeature(feature)
    return feature
  }
  updateScenicMarker(id: string, attrs: Record<string, any> = {}) {
    // 找到当前feature
    const currentFeature = this.markerSource?.getFeatureById(id)

    if (!currentFeature) {
      return
    }
    currentFeature.set('data', attrs)
    const curStyle = OlStyleFactory.getScenicStyleDefault(currentFeature)
    currentFeature.setStyle(curStyle)
  }
}
