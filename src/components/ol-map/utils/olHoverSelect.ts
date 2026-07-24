import { Feature, Map } from 'ol'
import { FeatureLike } from 'ol/Feature'
import { Geometry } from 'ol/geom'
import Select from 'ol/interaction/Select'
import VectorLayer from 'ol/layer/Vector'
import { OlStyleFactory } from './olStyleManage'

export class OlHoverSelect {
  private map: Map
  private polygonSelect: Select | null = null
  private markerSelect: Select | null = null

  constructor(map: Map) {
    this.map = map
  }
  //   给多边形layer添加鼠标hover交互
  addPolygonSelect(polygonLayerArr: VectorLayer<Feature<Geometry>>[]) {
    this.polygonSelect = new Select({
      layers: polygonLayerArr || [],
      style: (feature: FeatureLike) => {
        return OlStyleFactory.getPolygonStyleDefault(feature, true)
      },
      condition: (event: any) => {
        return event.type === 'pointermove'
      },
      filter: (feature: FeatureLike) => {
        return feature.get('featureType') === 'district' || feature.get('featureType') === 'polygon'
      }
    })
    this.polygonSelect.on('select', event => {
      //   console.log(event.selected)
      //   const pointerFeatureArr = ['marker']
      //   const eventFeature = event.selected[0]
      // eventFeature.setStyle(OlStyleFactory.getPolygonStyleDefault(eventFeature, true))
      //   this.map.getViewport().style.cursor =
      // pointerFeatureArr.includes(eventFeature?.get('featureType')) || '' ? 'pointer' : ''
    })
    this.map.addInteraction(this.polygonSelect)
  }
  //   给点layer添加鼠标hover交互
  addMarkerSelect(markerLayerArr: VectorLayer<Feature<Geometry>>[]) {
    this.markerSelect = new Select({
      layers: markerLayerArr || [],
      style: (feature: FeatureLike) => {
        return OlStyleFactory.getScenicStyleDefault(feature, true)
      },
      condition: (event: any) => {
        return event.type === 'pointermove'
      },
      filter: (feature: FeatureLike) => {
        return feature.get('featureType') === 'marker'
      }
    })
    this.markerSelect.on('select', event => {
      // console.log(event.selected)
      // const pointerFeatureArr = ['marker']
      const eventFeature = event.selected[0]
      // console.log('featureType=========', eventFeature?.get('featureType'))
      const featureType = eventFeature?.get('featureType')
      this.map.getViewport().style.cursor = featureType === 'marker' ? 'pointer' : ''
    })
    this.map.addInteraction(this.markerSelect)
  }
  destroy() {
    this.polygonSelect && this.map.removeInteraction(this.polygonSelect)
    this.polygonSelect = null
    this.markerSelect && this.map.removeInteraction(this.markerSelect)
    this.markerSelect = null
  }
}
