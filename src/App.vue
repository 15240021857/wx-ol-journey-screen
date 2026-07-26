<template>
  <div class="screen-container">
    <div class="map-background">
      <WeatherMap />
    </div>

    <div class="header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">🌐</span>
          <span class="logo-text">{{ mapRegionStore.curRegion?.name || '当前城市' }}智慧城市</span>
          <el-cascader
            v-model="regionValue"
            :options="regionTreeOptions?.children || []"
            :props="{
              label: 'name',
              value: 'treeID',
              children: 'children',
              checkStrictly: true
            }"
            filterable
            clearable
            placeholder="请选择区域"
            @change="handleRegionChange"
          />
        </div>
      </div>
      <div class="header-center">
        <h1 class="title">{{ mapRegionStore.curRegion?.name || '当前城市' }}天气与景点数据大屏</h1>
        <div class="subtitle">实时监控 · 数据可视化</div>
      </div>
      <div class="header-right">
        <UpdateTime />
      </div>
    </div>

    <div class="left-panel">
      <div class="panel-section">
        <MainCityChart />
      </div>
      <div class="panel-section">
        <MainCityWeekWeatherChart />
      </div>
      <div class="panel-section">
        <WeatherSummary />
      </div>
    </div>

    <div class="right-panel">
      <div class="panel-section">
        <bodyFeelChart ref="bodyFeelChartRef" />
      </div>
      <div class="panel-section">
        <AirQualityChat ref="AirQualityChatRef" />
      </div>
      <div class="panel-section">
        <ScenicWarningTable ref="warningTableRef" />
      </div>
    </div>

    <div class="footer">
      <div class="footer-info">
        <!-- <span>数据更新时间: {{ updateTime }}</span> -->
        <span>数据来源: 和风天气</span>
      </div>
    </div>

    <div class="corner-decorations">
      <div class="corner top-left"></div>
      <div class="corner top-right"></div>
      <div class="corner bottom-left"></div>
      <div class="corner bottom-right"></div>
    </div>

    <div class="grid-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef } from 'vue'
import WeatherMap from '@/components/WeatherMapSDK.vue'
import bodyFeelChart from '@/components/bodyFeelChart.vue'
import ScenicWarningTable from '@/components/ScenicWarningTable.vue'
import AirQualityChat from '@/components/AirQualityChat.vue'

import MainCityChart from '@/components/MainCityChart.vue'
import MainCityWeekWeatherChart from '@/components/MainCityWeekWeatherChart.vue'
import WeatherSummary from '@/components/WeatherSummary.vue'
import { useScenicStore } from './store/modules/useScenicStore'
// import { warningListData } from './data/warningMockData'
import { ScenicItem } from '@/data/mockData'
import { WarningTableItem } from './type/weather'
import { useMapRegionChoose } from './hooks/useMapRegionChoose'
import UpdateTime from '@/components/components/UpdateTime.vue'
import { useMapRegionStore } from './store/modules/useMapRegionStore'

// 地图区域选择
const { regionTreeOptions } = useMapRegionChoose()
console.log('regionTreeOptions==', regionTreeOptions)

const mapRegionStore = useMapRegionStore()
const regionValue = ref(['1-12', '1-12-15'])
// 区域选择变化
const handleRegionChange = (val: any) => {
  console.log('val====', val)
  console.log('regionValue==', regionValue)
  let curRegionTreeId = val[val.length - 1]
  mapRegionStore.setCurRegionTreeId(curRegionTreeId)
  // 获得区域子节点
  // const regionChildList = getRegionChildList(curRegionTreeId)
  // console.log('regionChildList==', regionChildList)
}

const scenicStore = useScenicStore()
const bodyFeelChartRef = useTemplateRef('bodyFeelChartRef')
const AirQualityChatRef = useTemplateRef('AirQualityChatRef')
const warningTableRef = useTemplateRef('warningTableRef')
// 监听景点列表变化，设置echarts
watch(
  () => scenicStore.scenicList,
  newVal => {
    // 体感温度
    const bodyFeelList = scenicStore.newScenicList
      .map(item => {
        const curNewItem = newVal?.find((i: ScenicItem) => i.id === item.id)
        return {
          name: curNewItem?.name || '',
          bodyFeel: curNewItem?.nowWeather?.feelsLike || 0,
          temp: curNewItem?.nowWeather?.temp || 0
        }
      })
      ?.sort((a, b) => a.bodyFeel - b.bodyFeel)
      ?.filter((item, index) => index <= 6)
    bodyFeelChartRef.value?.renderChart(bodyFeelList)
    // 空气质量
    const airQualityList = scenicStore.newScenicList

      .map(item => {
        const curNewItem = newVal?.find((i: ScenicItem) => i.id === item.id)
        return {
          name: curNewItem?.name || '',
          aqi: curNewItem?.airquality?.aqi || 0,
          pm25: curNewItem?.airquality?.primaryPollutant?.value || 0,
          pm25unit: curNewItem?.airquality?.primaryPollutant?.unit || ''
        }
      })
      ?.sort((a, b) => a.aqi - b.aqi)
      ?.filter((item, index) => index <= 6)
    AirQualityChatRef.value?.renderChart(airQualityList)
    // 告警列表
    const warningList: WarningTableItem[] = scenicStore.newScenicList
      .map(item => {
        const curNewItem = newVal?.find((i: ScenicItem) => i.id === item.id)
        const { eventName, headline, description, effectiveTime, icon, color } =
          curNewItem?.warning?.[0] || {}
        return {
          scenicId: curNewItem?.id || '',
          name: curNewItem?.name || '',
          eventName: eventName || '',
          headline: headline || '',
          description: description || '',
          effectiveTime: effectiveTime || '',
          icon: icon || '',
          color: `rgba(${color?.red || 0}, ${color?.green || 0}, ${color?.blue || 0}, ${color?.alpha || 0.8})`
        }
      })
      .filter(item => item.eventName !== '')
    // console.log('warningListData==', warningListData)

    warningTableRef.value?.setTableData(warningList)
  }
)
watch(
  () => mapRegionStore.topojsonMapLoaded,
  newVal => {
    if (newVal) {
      // 等待topojson加载完成
      handleRegionChange(regionValue.value)
    }
  }
)
onMounted(() => {
  // handleRegionChange(regionValue.value)
})
</script>

<style scoped>
.screen-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.map-background {
  position: absolute;
  top: 0.7rem;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 200, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 5;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.4rem;
  background: rgba(5, 20, 40, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 200, 255, 0.15);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.logo-icon {
  font-size: 0.3rem;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.logo-text {
  font-size: 0.18rem;
  color: #00d4ff;
  font-weight: 600;
}

.header-center {
  text-align: center;
}

.title {
  font-size: 0.28rem;
  color: #fff;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 15px rgba(0, 200, 255, 0.6);
}

.subtitle {
  font-size: 0.11rem;
  color: #888;
  margin-top: 0.03rem;
}

.header-right {
  text-align: right;
}

.left-panel {
  position: absolute;
  top: calc(0.7rem + 0.2rem);
  left: 0.1rem;
  width: 22%;
  bottom: calc(0.35rem + 0.2rem);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  z-index: 100;
}

.panel-section {
  flex: 1;
  background: rgba(5, 20, 40, 0.55);
  backdrop-filter: blur(8px);

  border-radius: 0.08rem;
}

.right-panel {
  position: absolute;
  top: calc(0.7rem + 0.2rem);
  right: 0.1rem;
  width: 25%;
  bottom: calc(0.35rem + 0.2rem);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  z-index: 100;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.4rem;
  background: rgba(5, 20, 40, 0.65);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(0, 200, 255, 0.15);
  z-index: 100;
}

.footer-info {
  display: flex;
  gap: 2vw;
  font-size: 0.09rem;
  color: #aaa;
}

.corner-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 99;
}

.corner {
  position: absolute;
  width: 1.2rem;
  height: 1.2rem;
  border: 4px solid rgba(0, 200, 255, 0.25);
}

.corner.top-left {
  top: calc(0.7rem + 0.1rem);
  left: 0.02rem;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: calc(0.7rem + 0.1rem);
  right: 0.02rem;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: calc(0.35rem + 0.1rem);
  left: 0.02rem;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: calc(0.35rem + 0.1rem);
  right: 0.02rem;
  border-left: none;
  border-top: none;
}

@media screen and (max-width: 1280px) {
  .title {
    font-size: 0.22rem;
  }

  .time {
    font-size: 0.24rem;
  }

  .left-panel {
    width: 26vw;
  }

  .right-panel {
    width: 28vw;
  }
}
</style>
