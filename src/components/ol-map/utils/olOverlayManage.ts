import { Map as OlMap, Overlay } from 'ol'
import OlWeatherOverlay from '@/components/ol-map/components/OlWeatherOverlay.vue'
import { Component, createVNode, render } from 'vue'

export interface OpenOverlayParams {
  key: string
  coordinate: number[]
  params?: any
  type?: 'weather'
}

export class OlOverlayManage {
  private map: OlMap
  private overlaysMap: Map<string, Overlay> = new Map()
  constructor(map: OlMap) {
    this.map = map
  }
  /**
   * 注册overlay
   * @param overlayDomList overlay的key和dom元素列表
   */
  registerOverlay(overlayDomList: { key: string; dom: HTMLDivElement }[]) {
    for (const item of overlayDomList) {
      const overlay = new Overlay({
        element: item.dom,
        id: item.key,
        // 弹窗「对齐锚点」：弹窗自身哪个点对准地图坐标
        positioning: 'bottom-center',
        // 偏移量，微调弹窗距离点位的距离
        offset: [0, -30],
        // 地图缩放时自动更新位置
        autoPan: true
      })
      this.map.addOverlay(overlay)
      this.overlaysMap.set(item.key, overlay)
    }
  }
  /**
   * 打开overlay
   * @param key overlay的key
   */
  openOverlay({ key, coordinate, params = {}, type = 'weather' }: OpenOverlayParams) {
    const overlay = this.overlaysMap.get(key)
    if (overlay) {
      const curDom = overlay.getElement() as HTMLDivElement
      let curComponent: Component | null = null
      if (type === 'weather') {
        // 天气图标overlay
        curComponent = OlWeatherOverlay
      } else {
        return
      }
      const componentVNode = createVNode(curComponent!, {
        ...params,
        onClose: () => {
          render(null, curDom)
          overlay.setPosition(undefined)
        }
      })
      render(componentVNode, curDom)
      overlay.setPosition(coordinate)
    }
  }
  //   关闭某个overlay
  closeOverlay(key: string) {
    const overlay = this.overlaysMap.get(key)
    if (overlay) {
      render(null, overlay.getElement() as HTMLDivElement)
      overlay.setPosition(undefined)
    }
  }
  // 关闭所有overlay
  destroy() {
    this.overlaysMap.forEach(overlay => {
      render(null, overlay.getElement() as HTMLDivElement)
      overlay.setPosition(undefined)
    })
    this.overlaysMap.clear()
  }
}
