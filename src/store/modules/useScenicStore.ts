import { ScenicItem } from '@/data/mockData'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScenicStore = defineStore('scenic', () => {
  // 景点列表，包含POI信息，实时天气数据，实时空气质量数据，实时预警数据
  const scenicList = ref([] as ScenicItem[])
  const newScenicList = ref([] as ScenicItem[])
  // 设置景点列表
  const setScenicList = (list: ScenicItem[]) => {
    scenicList.value = list
  }
  // 设置新增景点列表
  const setNewScenicList = (list: ScenicItem[]) => {
    newScenicList.value = list
  }
  return {
    scenicList,
    setScenicList,
    setNewScenicList,
    newScenicList
  }
})
