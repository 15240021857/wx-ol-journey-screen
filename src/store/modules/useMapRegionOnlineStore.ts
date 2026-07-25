import { CurRegion, RegionTreeItem } from '@/type/weather'
import { defineStore } from 'pinia'
import { ref } from 'vue'
// import topoOpenjson from '@/data/topoOpen.json'
import * as topojsonClient from 'topojson-client'
import { regionChildItem } from '@/type/weather'
import { getAliyunGeojson } from '@/api/map'

export const useMapRegionOnlineStore = defineStore('mapRegionOnline', () => {
  // 当前地区treeId
  const curRegionAdcode = ref<string>('')
  // 当前选中区域
  const curRegion = ref<CurRegion>({
    adcode: '',
    name: '',
    center: [],
    centroid: [],
    level: ''
  })
  // 当前地区子节点, 用来画子区域，拿子区域的天气数据
  const curRegionChildList = ref<regionChildItem[]>([])
  //   adcode 和 地区的topo 映射关系
  const regionTopoMap = new Map<string, any>()
  // 是否加载完成topojson映射关系 ---耗时操作放进worker
  const topojsonMapLoaded = ref(false)

  const setCurRegionAdcode = (adcode: string) => {
    curRegionAdcode.value = adcode
  }
  const setCurRegionChildList = (childList: regionChildItem[]) => {
    curRegionChildList.value = childList
  }
  const setCurRegion = (region: CurRegion) => {
    curRegion.value = region
  }
  // 设置当前区域geojson
  const getRegionGeojson = async (adcode: string) => {
    console.log('getRegionGeojson==== adcode=====', adcode)

    const curRegionGeojson = await getAliyunGeojson(adcode)
    console.log('curRegionGeojson====####################', curRegionGeojson)

    return curRegionGeojson
  }
  return {
    curRegionAdcode,
    curRegion,
    curRegionChildList,
    topojsonMapLoaded,
    setCurRegion,
    setCurRegionAdcode,
    getRegionGeojson,
    setCurRegionChildList
  }
})
