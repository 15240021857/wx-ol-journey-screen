<template>
  <div
    class="weather-map-container"
    v-loading="curLoading"
    :element-loading-spinner="loadingConfig.spinner"
    :element-loading-svg-view-box="loadingConfig.svgViewBox"
    :element-loading-custom-class="loadingConfig.customClass"
    :element-loading-background="loadingConfig.background"
  >
    <div ref="mapRef" class="map-wrapper"></div>
    <!-- 弹窗 -->
    <OlWeatherDialog ref="weatherDialogRef" />
    <!-- overlay 容器 -->
    <div ref="overlayContainerRef" class="overlay-weather-container"></div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  useTemplateRef,
  shallowRef,
  nextTick,
  toRaw,
  watch
} from 'vue'
// @ts-ignore
import { chizhouDistrict } from '@/data/chizhouDistrict'
// @ts-ignore
import { chizhouBoundary } from '@/data/chizhouBoundary'
import { type ScenicItem } from '@/data/mockData'

import { createOlBaseMap, OlUtil } from '@/components/ol-map'
import { requestConcurrency } from '@/util'
import { useWeatherStore } from '@/store/modules/useWeatherStore'

import OlWeatherDialog from '@/components/ol-map/components/OlWeatherDialog.vue'
import { regionChildItem, ScenicDataItem } from '@/type/weather'
import { useLocationStore } from '@/store/modules/useLocationStore'
import { useDebounce } from '@/hooks'
import { useScenicStore } from '@/store/modules/useScenicStore'
import { useMapRegionStore } from '@/store/modules/useMapRegionStore'
import { useMapRegionChoose } from '@/hooks/useMapRegionChoose'
import { loadingConfig } from '@/directive/loadingSetting'

const mapRef = ref(null)
// 实例初始化
const olBaseMap = createOlBaseMap()
// const getNowWeatherFun = async () => {
//   const res = await getNowWeather({ location: 101220902 })
//   console.log(res)
// }
const weatherStore = useWeatherStore()
const locationStore = useLocationStore()
const scenicStore = useScenicStore()
// 定时器timer
let getNowWeatherTimer: number | null = null
// 定时器间隔 15分钟
const getNowWeatherInterval = 15 * 60 * 1000
// 关闭定时器-获取实时天气
const clearGetNowWeatherTimer = () => {
  getNowWeatherTimer && clearTimeout(getNowWeatherTimer)
}
// 处理实时天气
// scenicList.value = MockScenicList
// 实时天气类型 与获取函数
type RealTimeType = 'nowWeather' | 'airquality' | 'warning'
const realTimeApiMap = {
  nowWeather: weatherStore.getNowWeatherFun,
  airquality: weatherStore.getAirqualityFun,
  warning: weatherStore.getWarningFun
}
const handleRealTimeWeather = async (type: RealTimeType) => {
  console.log('处理实时天气数据==')
  let realTimeApi = realTimeApiMap[type]
  if (!realTimeApi) {
    console.error('未找到对应的实时天气接口')
    return
  }
  // 获取实时天气数据s
  const funList = scenicStore.scenicList.map((item: ScenicItem) => {
    // return () => weatherStore.getNowWeatherFun(item.locationId)
    const lnglat = [Number(item.lon).toFixed(2), Number(item.lat).toFixed(2)]
    return () => realTimeApi(lnglat)
  })
  // 接口较多 控制并发2个请求一起
  const resGroupArr = await requestConcurrency(funList, 2)
  // 合并天气数据
  const newScenicList = scenicStore.scenicList.map((item: ScenicItem, index) => {
    return {
      ...item,
      [type]: toRaw(resGroupArr[index])
    }
  })
  scenicStore.setScenicList(newScenicList)
  // 更新景点实时天气
  olBaseMap.updateScenicMarkerList(scenicStore.scenicList)
  // 清除定时器
  clearGetNowWeatherTimer()
  getNowWeatherTimer = setTimeout(() => {
    handleRealTimeWeather(type)
  }, getNowWeatherInterval)
}
// 获取所有实时天气数据
const getAllRealTimeData = async () => {
  await handleRealTimeWeather('nowWeather')
  await handleRealTimeWeather('airquality')
  await handleRealTimeWeather('warning')
  console.log('所有实时天气数据获取完成', scenicStore.scenicList)
}
// overlay注册
const overlayContainerRef = useTemplateRef<HTMLDivElement>('overlayContainerRef')
const registerOverlayFun = () => {
  olBaseMap?.overlayManage?.registerOverlay([
    {
      key: 'weatherOverlay',
      dom: overlayContainerRef.value!
    }
  ])
}
// 弹窗ref
const weatherDialogRef = useTemplateRef<InstanceType<typeof OlWeatherDialog>>('weatherDialogRef')
// 天气
const weatherDialogData = ref(null)
// map事件回调
const onMapClickCallback = ({ wgsLnglat, coordinate, hitFeature }: any) => {
  console.log(wgsLnglat, coordinate, hitFeature)
  const params = hitFeature?.get('data') || {}
  console.log('params==', params)
  if (hitFeature?.get('featureType') === 'marker') {
    olBaseMap.overlayManage?.openOverlay({
      key: 'weatherOverlay',
      coordinate,
      params: {
        data: params,
        onOpenDetailDialog: (data: ScenicDataItem) => {
          console.log('data==', data)

          weatherDialogRef.value?.openDialog(data)
        }
      }
    })
  } else {
    olBaseMap.overlayManage?.closeOverlay('weatherOverlay')
  }
}
const onMapMoveendCallback = async ({ gcjCenterlnglat, center, view }: any) => {
  // 处理实时天气
  // handleNowWeather()
  const gcjStr = `${gcjCenterlnglat[0].toFixed(2)},${gcjCenterlnglat[1].toFixed(2)}`
  const poi: any = await locationStore.getPOIFun({
    // city: 'chizhou',
    location: gcjStr,
    type: 'scenic',
    number: 20
  })
  let newScenicList: ScenicItem[] = []
  scenicStore.setNewScenicList(poi || [])
  for (let scenic of poi || []) {
    const isExist = scenicStore.scenicList.some((item: ScenicItem) => item.id === scenic.id)
    if (!isExist) {
      newScenicList.push(scenic)
    }
  }
  scenicStore.setScenicList([...scenicStore.scenicList, ...newScenicList])

  // 添加新景点图层
  olBaseMap.addScenicMarkerList(newScenicList)
  nextTick(() => {
    getAllRealTimeData()
  })
}

const { debounceFun: debounceOnMapMoveendCallback } = useDebounce(onMapMoveendCallback, {
  delay: 1000
})
// 当前region地图发生变化时，更换地图蒙层展示，镜头View移动
const mapRegionStore = useMapRegionStore()
const { getRegionChildMapList } = useMapRegionChoose()
const curLoading = ref(true)
watch(
  () => mapRegionStore.curRegionTreeId,
  async newVal => {
    if (newVal) {
      setCurRegionData(newVal)
      curLoading.value = false
    }
  }
)
const setCurRegionData = (curTreeId: string) => {
  const regionGeojson = mapRegionStore.getRegionGeojson(curTreeId)
  if (regionGeojson) {
    olBaseMap.layerManage?.regionSource?.clear()
    console.log('cur regionGeojson=====', regionGeojson)
    const curFeature = regionGeojson?.features?.[0]
    const { level, name, center, centroid } = curFeature?.properties || {}
    // 更新当前选中区域
    mapRegionStore.setCurRegion({
      treeId: curTreeId,
      name,
      center,
      centroid,
      level
    })
    // 加载当前区域地图layer
    olBaseMap.addGeojsonLayer(regionGeojson, 'region', level)
    const extent = olBaseMap.layerManage?.regionSource?.getExtent()
    olBaseMap.map?.getView()?.fit(extent!, {
      duration: 1500,
      easing: t => 1 - Math.pow(1 - t, 3), // 先快后慢，地图飞行最优缓动
      padding: [100, 100, 100, 100],
      maxZoom: 11
    })
    renderRegionChild(curTreeId)
  }
}
// 渲染子区域
const renderRegionChild = (regionTreeId: string) => {
  const childMapList = getRegionChildMapList(regionTreeId)
  // 子区域存起来用于获取天气数据
  let regionChildList: regionChildItem[] = []
  if (childMapList.length > 0) {
    for (let child of childMapList) {
      const childGeojson = mapRegionStore.getRegionGeojson(child.treeID)
      const curChildFeature = childGeojson?.features?.[0]
      const { center, name, level, centroid } = curChildFeature?.properties || {}
      olBaseMap.addGeojsonLayer(childGeojson, 'region', level)
      regionChildList.push({
        treeId: child.treeID,
        name,
        center,
        centroid,
        level
      })
    }
    mapRegionStore.setCurRegionChildList(regionChildList)
  }
}
onMounted(async () => {
  // const warningRes = await weatherStore.getWarningFun([116.25, 30.46])
  // 市中心点（用地理中心点，保证地图中心在池州中心）
  const gcjCenter = chizhouBoundary.features?.[0].properties?.centroid
  const wgs84Center = OlUtil.gcj02ToWgs84(gcjCenter)
  // 地图初始化
  olBaseMap.init(mapRef.value!, {
    center: wgs84Center || [117.5, 30.45],
    zoom: 9.5,
    minZoom: 3,
    maxZoom: 18
  })
  // 添加区县图层
  // olBaseMap.addGeojsonLayer(chizhouBoundary, 'polygon', 'city')
  // olBaseMap.addGeojsonLayer(chizhouDistrict, 'polygon', 'district')
  // 处理实时天气
  // handleRealTimeWeather('nowWeather')
  // handleRealTimeWeather('airquality')
  // handleRealTimeWeather('warning')
  // 注册overlay
  registerOverlayFun()
  // 地图点击事件
  olBaseMap.mapEvent?.onMapClick(onMapClickCallback)
  // 地图拖动结束事件
  olBaseMap.mapEvent?.onMapMoveend(debounceOnMapMoveendCallback)
})

onUnmounted(() => {
  olBaseMap.destroy()
  clearGetNowWeatherTimer()
})
</script>

<style scoped lang="scss">
.weather-map-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.map-wrapper {
  width: 100%;
  height: 100%;
}
:deep(.ol-control) {
  display: flex;
  position: relative;
  left: calc(22vw + 16px);
  top: calc(70px + 20px);
  pointer-events: none !important;
  button {
    pointer-events: auto !important;
  }
}
</style>
