<template>
  <div class="weather-summary-container glass-card">
    <div class="card-title">{{ mapRegionStore.curRegion?.name || '当前城市' }}主要地区实时天气</div>
    <div
      class="card-body"
      v-loading="curLoading"
      :element-loading-spinner="loadingConfig.spinner"
      :element-loading-svg-view-box="loadingConfig.svgViewBox"
      :element-loading-custom-class="loadingConfig.customClass"
      :element-loading-background="loadingConfig.background"
      style="height: calc(100% - 0.3rem)"
    >
      <div
        class="scroll-wrapper"
        ref="scrollbarRef"
        height="100%"
        width="100%"
        @scroll="onScroll"
        @mouseenter="cancelTimer"
        @mouseleave="startAutoScroll"
      >
        <div class="weather-grid" ref="scrollContainerRef">
          <div
            v-for="item in weatherList"
            :key="item.name"
            class="weather-card"
            :class="{ 'has-warning': item.warning }"
            @click="handleClick(item)"
          >
            <div class="weather-header">
              <span class="weather-icon">
                <img
                  :src="getYrIcon(item.nowWeather?.icon || '')"
                  alt="天气图标"
                  width="36"
                  height="36"
                />
                <div class="weather-text">{{ item.nowWeather?.text || '' }}</div>
              </span>
              <!-- <span
            v-if="item.warning"
            class="warning-badge"
            :style="{ backgroundColor: getWarningColor(item.warning) }"
          >
            {{ getWarningLevel(item.warning) }}
          </span> -->
            </div>
            <div class="weather-name">{{ item.name }}</div>
            <div class="weather-temp">{{ item.nowWeather?.temp || 'N/A' }}°C</div>
            <div class="weather-item">体感: {{ item.nowWeather?.feelsLike || 'N/A' }}°C</div>
            <div class="weather-item">湿度: {{ item.nowWeather?.humidity || 'N/A' }}%</div>
            <div class="weather-item">
              {{ `${item.nowWeather?.windDir} ${item.nowWeather?.windScale}级` || 'N/A' }}
            </div>
            <!-- <div class="weather-item">能见度: {{ item.nowWeather?.vis || 'N/A' }}km</div> -->
            <div class="weather-item">{{ item.nowWeather?.pressure || 'N/A' }}hPa</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeatherStore } from '@/store/modules/useWeatherStore'
import { onMounted, onUnmounted, ref, toRaw, useTemplateRef, watch } from 'vue'
import { getYrIcon } from './ol-map/utils/hefeng-weather-icon'
import { useMapRegionStore } from '@/store/modules/useMapRegionStore'
import { regionChildItem } from '@/type/weather'
import { loadingConfig } from '@/directive/loadingSetting'

const mapRegionStore = useMapRegionStore()
const weatherStore = useWeatherStore()
const weatherList = ref<regionChildItem[]>([])
// 获取区县和主要景区实时天气
const getDistrictWeather = async (districtList: regionChildItem[]) => {
  const resList = await Promise.all(
    districtList.map(async district => {
      const [lng, lat] = district.center
      return await weatherStore.getNowWeatherFun([lng, lat])
    })
  )
  weatherList.value = districtList || []
  resList.forEach((item, index) => {
    const newWeather = {
      ...districtList[index],
      nowWeather: toRaw(item)
    }
    weatherList.value.splice(index, 1, newWeather)
  })
}
const handleClick = (item: any) => {
  console.log('item====', item)
}
const curLoading = ref(true)
watch(
  () => mapRegionStore.curRegionChildList,
  newVal => {
    if (newVal) {
      getDistrictWeather(newVal)
      curLoading.value = false
      setTimeout(() => {
        startAutoScroll()
      }, 1000)
    }
  }
)
// 滚动条
const scrollbarRef = useTemplateRef<HTMLDivElement>('scrollbarRef')
const onScroll = () => {
  console.log('scroll====', scrollbarRef.value?.scrollLeft)
}
let autoScrollTimer: number | null = null
let curScrollTime: number = 0 // 滚了几次
const scrollContainerRef = useTemplateRef<HTMLDivElement>('scrollContainerRef')
const startAutoScroll = () => {
  const totalLen = weatherList.value.length || 0
  const clientLen = 4
  const overflowLen = totalLen - clientLen
  if (overflowLen <= 0) {
    console.log('够放，不用滚动')
    return
  }
  if (curScrollTime >= overflowLen) {
    curScrollTime = 0
  } else {
    curScrollTime++
  }

  const curCardItemWidth = getCardItemWidth()
  if (scrollContainerRef.value) {
    scrollContainerRef.value.style.transform = `translateX(-${(curCardItemWidth + 8) * curScrollTime}px)`
  }

  cancelTimer()
  autoScrollTimer = setTimeout(() => {
    startAutoScroll()
  }, 3000)
}
const getCardItemWidth = () => {
  const cardItem = scrollbarRef.value?.querySelector('.weather-card')
  if (cardItem) {
    return cardItem.clientWidth
  }
  return 68.5
}
const cancelTimer = () => {
  if (autoScrollTimer) {
    clearTimeout(autoScrollTimer)
    autoScrollTimer = null
  }
}
onMounted(() => {
  startAutoScroll()
})
onUnmounted(() => {
  cancelTimer()
})
</script>

<style scoped>
.weather-summary-container {
  width: 100%;
  height: 100%;
  padding: 0.1rem;
  position: relative;
  background: transparent;
}
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.weather-grid {
  /* display: grid;
  grid-template-columns: repeat(5, 1fr); */
  display: flex;
  flex-flow: row nowrap;
  gap: 0.08rem;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.weather-card {
  flex: 1 0 auto;
  flex-basis: 23%;
  background: rgba(5, 20, 40, 0.5);
  backdrop-filter: blur(4px);
  border-radius: 0.06rem;
  padding: 0.08rem 0.04rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(0, 200, 255, 0.1);
  box-sizing: border-box;
}

.weather-card:hover {
  background: rgba(10, 80, 150, 0.6);
  border-color: rgba(0, 200, 255, 0.5);
  /* transform: scale(1.0); */
}

.weather-card.has-warning {
  border-color: rgba(255, 77, 79, 0.5);
  animation: warningPulse 2s ease-in-out infinite;
}

@keyframes warningPulse {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(255, 77, 79, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 77, 79, 0.6);
  }
}

.weather-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.05rem;
  margin-bottom: 0.05rem;
}

.weather-icon {
  font-size: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.weather-text {
  font-size: 0.12rem;
  color: #fff;
}

.warning-badge {
  font-size: 0.08rem;
  padding: 0.02rem 0.05rem;
  border-radius: 3px;
  color: #fff;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.weather-name {
  font-size: 0.14rem;
  color: #00d4ff;
  margin-bottom: 0.05rem;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.weather-temp {
  font-size: 0.18rem;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.03rem;
}

.weather-humidity {
  font-size: 0.1rem;
  color: #aaa;
}
.weather-item {
  font-size: 0.12rem;
  color: #aaa;
  /* white-space: nowrap; */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 0.18rem;
}
</style>
