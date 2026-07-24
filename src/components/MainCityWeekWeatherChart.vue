<template>
  <div class="scenic-count-chart-container glass-card">
    <div class="card-title">{{ mapRegionStore.curRegion?.name || '当前城市' }}最近一周天气</div>
    <div
      class="loading-warp"
      v-loading="curLoading"
      :element-loading-spinner="loadingConfig.spinner"
      :element-loading-svg-view-box="loadingConfig.svgViewBox"
      :element-loading-custom-class="loadingConfig.customClass"
      :element-loading-background="loadingConfig.background"
    >
      <div ref="chartRef" class="chart-wrapper"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useWeatherStore } from '@/store/modules/useWeatherStore'
import { CurRegion, DaysWeatherProps } from '@/type/weather'
import { getYrIcon } from './ol-map/utils/hefeng-weather-icon'
import { getWeekDateText } from '@/util'
import { useMapRegionStore } from '@/store/modules/useMapRegionStore'
import { loadingConfig } from '@/directive/loadingSetting'

const weatherStore = useWeatherStore()
const locationDaysNowWeather = ref<DaysWeatherProps[]>([])
// 获取当前城市 今日天气
const getLocationWeather = async (curRegion: CurRegion) => {
  // 获取主城市
  const [lon, lat] = curRegion?.center || []
  const weatherData = await weatherStore.getDaysWeatherFun([lon, lat])
  locationDaysNowWeather.value = weatherData || []
  renderChart(weatherData || [])
}
const chartRef = ref(null)
let chart: echarts.ECharts | null = null
const renderChart = (data: DaysWeatherProps[]) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 30, 60, 0.9)',
      borderColor: 'rgba(0, 200, 255, 0.3)',
      textStyle: {
        color: '#fff'
      },
      // formatter: (params: any) => {
      //   // return getWeekDateText(params.name)
      // },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      // type: 'value',
      data: data?.map(item => item.fxDate) || [],
      axisLabel: {
        color: '#aaa',
        formatter: (value: string) => getWeekDateText(value)
        // rotate: 26
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.3)'
        }
      }
    },
    yAxis: {
      // type: 'category',
      axisLabel: {
        color: '#aaa'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.1)'
        }
      }
    },
    series: [
      {
        name: '白天',
        type: 'line',
        showSymbol: true,
        data:
          data?.map((item, index) => {
            const icon = getYrIcon(item.iconDay || '')
            return {
              value: item.tempMax || 0,
              symbol: icon ? `image://${getYrIcon(icon) || ''}` : 'circle',
              symbolSize: 26
            }
          }) || [],
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 12
        }
        // emphasis: {
        //   itemStyle: {
        //     shadowBlur: 10,
        //     shadowColor: 'rgba(0, 200, 255, 0.5)'
        //   }
        // }
      },
      {
        name: '夜晚',
        type: 'line',
        data:
          data?.map(item => {
            const icon = getYrIcon(item.iconNight || '')
            return {
              value: item.tempMin || 0,
              symbol: icon ? `image://${getYrIcon(icon) || ''}` : 'circle',
              symbolSize: 26
            }
          }) || [],
        label: {
          show: true,
          position: 'bottom',
          color: '#fff',
          fontSize: 12
        },
        itemStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
  chart?.setOption(option)
}
const mapRegionStore = useMapRegionStore()
const curLoading = ref(true)
watch(
  () => mapRegionStore.curRegion,
  async curRegion => {
    await getLocationWeather(curRegion)
    curLoading.value = false
  }
)

onMounted(() => {
  chart = echarts.init(chartRef.value)
  renderChart([])

  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  chart?.resize()
}

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.scenic-count-chart-container {
  width: 100%;
  height: 100%;
  padding: 0.1rem;
  position: relative;
  background: transparent;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
}
.loading-warp {
  width: 100%;
  height: calc(100% - 0.3rem);
}
</style>
