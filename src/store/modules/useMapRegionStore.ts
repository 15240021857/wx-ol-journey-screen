import { CurRegion, RegionTreeItem } from '@/type/weather'
import { defineStore } from 'pinia'
import { ref } from 'vue'
console.time('import topoOpenjson==========')
// import topoOpenjson from '@/data/topoOpen.json'
import * as topojsonClient from 'topojson-client'
console.timeEnd('import topoOpenjson==========')
import { regionChildItem } from '@/type/weather'

export const useMapRegionStore = defineStore('mapRegion', () => {
  // 当前地区treeId
  const curRegionTreeId = ref<string>('')
  // 当前选中区域
  const curRegion = ref<CurRegion>({
    treeId: '',
    name: '',
    center: [],
    centroid: [],
    level: ''
  })
  // 当前地区子节点, 用来画子区域，拿子区域的天气数据
  const curRegionChildList = ref<regionChildItem[]>([])
  //   treeId 和 地区的topo 映射关系
  let regionTopoMap = new Map<string, any>()
  // 是否加载完成topojson映射关系 ---耗时操作放进worker
  const topojsonMapLoaded = ref(false)

  const setCurRegionTreeId = (treeId: string) => {
    curRegionTreeId.value = treeId
  }
  const setCurRegionChildList = (childList: regionChildItem[]) => {
    curRegionChildList.value = childList
  }
  const setCurRegion = (region: CurRegion) => {
    curRegion.value = region
  }
  const worker = new Worker(new URL('@/worker/getMapGeojson.ts', import.meta.url), {
    type: 'module'
  })
  worker.postMessage({
    type: 'init',
    data: {
      isProd: import.meta.env.PROD,
      ROOT_URL: import.meta.env.BASE_URL
    }
  })
  worker.postMessage({
    type: 'getTopojsonMap'
  })
  worker.onmessage = e => {
    const { type, data } = e.data
    // console.log('!!!!!!!!!!!!!!!!!', e)

    if (type === 'getTopojsonMap') {
      // 获取所有区域topo映射关系
      regionTopoMap = data
      topojsonMapLoaded.value = true
    }
    // console.log('onmessage==============================', regionTopoMap.size)
  }
  // 获取所有区域topo映射关系
  // const getAllRegionGeojson = () => {
  //   // topojson转geojson
  // }
  // getAllRegionGeojson()
  // 设置当前区域geojson
  const getRegionGeojson = (treeId: string) => {
    let curRegionGeojson: any = null
    const curRegionTopo = regionTopoMap.get(treeId)
    if (curRegionTopo) {
      const curTopo = curRegionTopo?.payload
      curRegionGeojson = topojsonClient.feature(curTopo, curTopo?.objects?.collection)
    }
    return curRegionGeojson
  }
  return {
    curRegionTreeId,
    curRegion,
    curRegionChildList,
    topojsonMapLoaded,
    setCurRegion,
    setCurRegionTreeId,
    getRegionGeojson,
    setCurRegionChildList
  }
})
