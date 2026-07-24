import { Map as OlMap } from 'ol'
import { OlUtil } from './olUtil'

type mapClickCallback = ({
  wgsLnglat,
  coordinate,
  hitFeature
}: {
  wgsLnglat: number[]
  coordinate: number[]
  hitFeature: any
}) => void
export class OlMapEvent {
  private map: OlMap | null = null
  //   管理事件回调 与 事件函数的映射关系 方便卸载
  private eventMap = new Map<string, Map<Function, Function>>()
  constructor(map: OlMap) {
    this.map = map
  }
  //   当地图点击
  onMapClick(callback: mapClickCallback) {
    const olFun = (e: any) => {
      const wgsLnglat = OlUtil.epsg3857ToWgs84(e.coordinate)
      const hitFeature = this.map?.forEachFeatureAtPixel(e.pixel, f => f)
      callback({ wgsLnglat, coordinate: e.coordinate, hitFeature: hitFeature || null })
    }
    this.map?.on('click', olFun)
    let clickMap = this.eventMap.get('click')
    if (!clickMap) {
      this.eventMap.set('click', new Map())
      clickMap = this.eventMap.get('click')!
    }
    clickMap.set(callback, olFun)
  }
  // 当地图拖动结束
  onMapMoveend(callback: (e: any) => void) {
    const olFun = (e: any) => {
      const view = this.map?.getView()
      const center = view?.getCenter()
      const zoom = view?.getZoom()
      const wgsCenterlnglat = OlUtil.epsg3857ToWgs84(center!)
      const gcjCenterlnglat = OlUtil.wgs84ToGcj02(wgsCenterlnglat)
      callback({ e, wgsCenterlnglat, gcjCenterlnglat, center, view })
    }
    this.map?.on('moveend', olFun)
    let moveMap = this.eventMap.get('moveend')
    if (!moveMap) {
      this.eventMap.set('moveend', new Map())
      moveMap = this.eventMap.get('moveend')!
    }
    moveMap.set(callback, olFun)
  }
  off(type: any, cb: any) {
    const curMap = this.eventMap.get(type)
    if (curMap) {
      const olFun: any = curMap.get(cb)
      if (olFun) {
        this.map?.un(type, olFun)
        curMap.delete(cb)
      }
    }
    if (curMap?.size === 0) {
      this.eventMap.delete(type)
    }
  }

  destroy() {
    for (const [type, map] of this.eventMap) {
      if (!map || map.size === 0) {
        continue
      }
      for (const olHandler of map.values()) {
        this.map?.un(type as any, olHandler as any)
      }
      map.clear()
      this.eventMap.delete(type)
    }
  }
}
