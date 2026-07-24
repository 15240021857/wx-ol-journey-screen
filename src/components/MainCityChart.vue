<template>
  <div class="card-container glass-card">
    <div class="card-title">{{ mapRegionStore.curRegion?.name || '当前城市' }}今日天气</div>
    <div
      class="card-wrapper"
      v-loading="curLoading"
      :element-loading-spinner="loadingConfig.spinner"
      :element-loading-svg-view-box="loadingConfig.svgViewBox"
      :element-loading-custom-class="loadingConfig.customClass"
      :element-loading-background="loadingConfig.background"
    >
      <div class="sunset-warpper">
        <span class="sunrise">
          <span>日出</span> <span>{{ curLocationNowWeather?.sunrise ?? '00:00' }}</span>
        </span>
        <span class="sunset">
          <span>日落</span> <span>{{ curLocationNowWeather?.sunset ?? '00:00' }}</span>
        </span>
      </div>

      <div class="weather-header">
        <div class="weather-icon">
          <img
            :src="getYrIcon(curLocationNowWeather?.iconDay) || ''"
            alt="天气图标"
            width="60px"
            height="60px"
          />
          <span class="weather-text">{{ curLocationNowWeather?.textDay || '-' }}</span>
        </div>
        <div class="weather-temp">
          <div class="temp-item">
            <span class="temp-label">最高</span>
            <span class="temp-value">{{ curLocationNowWeather?.tempMax ?? '-' }}°</span>
          </div>
          <div class="temp-item">
            <span class="temp-label">最低</span>
            <span class="temp-value">{{ curLocationNowWeather?.tempMin ?? '-' }}°</span>
          </div>
        </div>
        <!-- <div class="weather-desc">
          {{ curLocationNowWeather?.desc }}
        </div> -->
      </div>
      <div class="weather-body">
        <div class="weather-top">
          <div class="weather-item">
            <span class="temp-value">{{ curLocationNowWeather?.windDirDay ?? '-' }}</span>
            <span class="temp-value">{{ curLocationNowWeather?.windSpeedDay ?? '-' }}级</span>
          </div>
          <span class="temp-value">|</span>
          <div class="weather-item">
            <span class="temp-value">湿度</span>
            <span class="temp-value">{{ curLocationNowWeather?.humidity ?? '-' }}%</span>
          </div>
          <span class="temp-value">|</span>
          <div class="weather-item">
            <span class="temp-value">降水量</span>
            <span class="temp-value">{{ curLocationNowWeather?.precip ?? '-' }}mm</span>
          </div>
        </div>

        <div class="weather-bottom">
          <div class="weather-item" :title="uvDict?.tip || ''">
            <span class="temp-value">紫外线</span>
            <span class="temp-value"
              >{{ `${curLocationNowWeather?.uvIndex ?? '-'}` }}
              <span :style="{ color: uvDict?.color || '' }">{{ uvDict?.name || '' }}</span>
            </span>
          </div>
          <span class="temp-value">|</span>
          <div class="weather-item">
            <span class="temp-value">空气质量</span>
            <span class="temp-value"
              >{{ airQualityData?.aqi ? `${airQualityData?.aqi}` : '-' }}
              <span :style="{ color: aqiColor }">{{ airQualityData?.category }}</span>
            </span>
          </div>
          <span class="temp-value">|</span>
          <div class="weather-item">
            <span class="temp-value">能见度</span>
            <span class="temp-value">
              {{ curLocationNowWeather?.vis ? `${curLocationNowWeather?.vis}km` || '-' : '-' }}
              <span :style="{ color: visDict?.color || '' }">{{ visDict?.name || '' }}</span>
            </span>
          </div>
        </div>
      </div>
      <div v-if="warningData?.length > 0" class="weather-warning">
        <div
          v-for="item in warningData"
          :key="item.id"
          class="warning-item clickable"
          :style="warningItemStyle(item.color)"
          @click="
            openWeatherDialog(
              { name: mapRegionStore.curRegion?.name + '今日天气预警', warning: warningData },
              'warning'
            )
          "
        >
          <!-- <span class="warning-icon">{{ item.icon }}</span> -->
          <span class="warning-text">{{ item.eventName }}</span>
        </div>
      </div>
    </div>
    <OlWeatherDialog ref="weatherDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, useTemplateRef } from 'vue'
import { useLocationStore } from '@/store/modules/useLocationStore'
import { useWeatherStore } from '@/store/modules/useWeatherStore'
import { getYrIcon } from './ol-map/utils/hefeng-weather-icon'
import {
  AirqualityProps,
  CurRegion,
  DaysWeatherProps,
  ScenicDataItem,
  UvIndexLevel,
  WarningProps
} from '@/type/weather'
import { getUvDict, uvColorMap, visMap } from '@/util/dict'
import { useMapRegionStore } from '@/store/modules/useMapRegionStore'
import OlWeatherDialog from './ol-map/components/OlWeatherDialog.vue'
import { loadingConfig } from '@/directive/loadingSetting'

const curLocationNowWeather = ref<DaysWeatherProps>({} as DaysWeatherProps)
const weatherStore = useWeatherStore()
const warningData = ref<WarningProps>([])
const airQualityData = ref<AirqualityProps>({} as AirqualityProps)
// 获取当前城市 今日天气
const getLocationWeather = async (curRegion: CurRegion) => {
  // 获取主城市
  const [lon, lat] = curRegion?.center || []
  const weatherData = await weatherStore.getDaysWeatherFun([lon, lat])
  curLocationNowWeather.value = weatherData?.[0] || ({} as DaysWeatherProps)
}
const uvDict = computed(() => {
  return getUvDict(+curLocationNowWeather.value?.uvIndex || 0)
})
const getLocationWarning = async (curRegion: CurRegion) => {
  // 获取主城市
  const [lon, lat] = curRegion?.center || []
  const res = await weatherStore.getWarningFun([lon, lat])
  warningData.value = res || ([] as WarningProps)
}
const warningItemStyle = (color: any) => {
  const { blue, green, red, alpha } = color
  return {
    backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }
}
// 空气质量
const getLocationAirQuality = async (curRegion: CurRegion) => {
  // 获取主城市
  const [lon, lat] = curRegion?.center || []
  const res = await weatherStore.getAirqualityFun([lon, lat])
  airQualityData.value = res || ({} as AirqualityProps)
}
const aqiColor = computed(() => {
  const { red, green, blue, alpha } = airQualityData.value?.color || {}
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
})
// 紫外线颜色
const uvColor = computed(() => {
  const uvIndex = +curLocationNowWeather.value?.uvIndex || ''
  return uvColorMap[uvIndex as keyof typeof uvColorMap] || ''
})
// 能见度
const visDict = computed(() => {
  const vis = Number(curLocationNowWeather.value?.vis) || 0
  let visLevel: keyof typeof visMap
  if (vis >= 10) {
    visLevel = 1
  } else if (vis >= 2) {
    visLevel = 2
  } else if (vis >= 1) {
    visLevel = 3
  } else if (vis >= 0.5) {
    visLevel = 4
  } else if (vis >= 0.05) {
    visLevel = 5
  } else {
    visLevel = 6
  }
  return visMap[visLevel as keyof typeof visMap]
})
const mapRegionStore = useMapRegionStore()
const curLoading = ref(true)
watch(
  () => mapRegionStore.curRegion,
  async curRegion => {
    await getLocationWeather(curRegion)
    await getLocationWarning(curRegion)
    await getLocationAirQuality(curRegion)
    curLoading.value = false
  }
)
const weatherDialogRef = useTemplateRef<InstanceType<typeof OlWeatherDialog>>('weatherDialogRef')
const openWeatherDialog = (scenicData: ScenicDataItem, type: 'scenic' | 'warning' = 'scenic') => {
  weatherDialogRef.value?.openDialog(scenicData, type)
}
</script>

<style scoped lang="scss">
.card-container {
  width: 100%;
  height: 100%;
  padding: 0.1rem;
  position: relative;
  background: transparent;
}

.card-wrapper {
  width: 100%;
  height: calc(100% - 0.3rem);
  color: #fff;
  // color: #00d4ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.1rem;
  position: relative;
  .sunset-warpper {
    position: absolute;
    top: 0.06rem;
    right: 0.08rem;
    font-size: 0.12rem;
    color: #eee;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.05rem;
    .sunrise {
      color: #ffb870;
    }
    .sunset {
      color: #ff6800;
    }
  }
  .weather-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.15rem;
    margin-top: -0.1rem;
  }
  .temp-label {
    font-size: 0.16rem;
    color: #09ccf3c0;
  }
  .weather-temp {
    font-size: 0.16rem;
    font-weight: bold;
    // text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.1rem;
    .temp-value {
      font-size: 0.24rem;
      color: #fff;
    }
  }
  .temp-item {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: flex-end;
    line-height: 0.26rem;
    gap: 0.05rem;
  }
  .weather-item {
    display: flex;
    flex-direction: row;
    gap: 0.05rem;
  }
  .weather-top {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.05rem;

    .temp-label {
      font-size: 0.12rem;
      color: #00d4ff;
    }
    .temp-value {
      font-size: 0.12rem;
      color: #eee;
    }
  }
  .weather-bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.05rem;
    .temp-label {
      font-size: 0.12rem;
      color: #00d4ff;
    }
    .temp-value {
      font-size: 0.12rem;
      color: #eee;
    }
  }
  .weather-icon {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: flex-end;
    gap: 0.05rem;
  }
  .weather-text {
    font-size: 0.16rem;
  }
  .weather-warning {
    display: flex;
    flex-direction: row;
    // margin-top: 0.05rem;
    gap: 0.05rem;
    position: absolute;
    top: 0.35rem;
    right: 0.08rem;
  }
  .warning-item {
    padding: 0.05rem 0.1rem;
    border-radius: 8px;
    color: #fff;
    font-size: 0.12rem;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
