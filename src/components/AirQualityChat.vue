<template>
  <div class="visitor-chart-container glass-card">
    <div class="card-title">景点空气质量情况</div>
    <div
      class="loading-body-warp"
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
import { AirQualityLevel } from '@/type/weather'
import { loadingConfig } from '@/directive/loadingSetting'
import { getFontSize } from '@/util/echarts-adapter'

const chartRef = ref(null)
let chart: echarts.ECharts | null = null
const getAirQualityLevel = (aqi: number) => {
  let aqiLevel = ''
  let richTextKey = ''
  if (aqi > 0 && aqi <= 50) {
    aqiLevel = AirQualityLevel.Good
    richTextKey = 'Good'
  }
  if (aqi > 50 && aqi <= 100) {
    aqiLevel = AirQualityLevel.Fair
    richTextKey = 'Fair'
  }
  if (aqi > 100 && aqi <= 150) {
    aqiLevel = AirQualityLevel.Unhealthy
    richTextKey = 'Unhealthy'
  }
  if (aqi > 150 && aqi <= 200) {
    aqiLevel = AirQualityLevel.VeryUnhealthy
    richTextKey = 'VeryUnhealthy'
  }
  if (aqi > 200 && aqi <= 300) {
    aqiLevel = AirQualityLevel.Hazardous
    richTextKey = 'Hazardous'
  }
  if (aqi > 300 && aqi <= 500) {
    aqiLevel = AirQualityLevel.Extreme
    richTextKey = 'Extreme'
  }
  return {
    aqiLevel,
    richTextKey
  }
}
const curLoading = ref(true)
const renderChart = (airQualityList: any[], firstRender: boolean = false) => {
  if (!firstRender) {
    curLoading.value = false
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(10, 30, 60, 0.9)',
      borderColor: 'rgba(0, 200, 255, 0.3)',
      textStyle: {
        fontSize: getFontSize(12),
        color: '#fff'
      },
      formatter: (params: any) => {
        const scenicName = params[0].name
        const scenicStr = `<div style="font-size: 14px;color:#00d4ff;font-weight: bold;line-height: 24px;">${scenicName}</div>`
        // console.log('params', params)

        const tempStr = params
          .map((item: any) => {
            // const curData = airQualityList.find(item => item.name === item.seriesName)
            return `${item.marker} ${item.seriesName}: ${item.value} `
          })
          .join('<br/>')
        return `${scenicStr}${tempStr}`
      }
    },
    legend: {
      data: ['AQI (CN)', 'PM2.5'],
      textStyle: {
        color: '#aaa',
        fontSize: getFontSize(12)
      },
      top: -2
    },
    grid: {
      left: '6%',
      right: '4%',
      bottom: '-4.2%',
      top: '23%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: airQualityList.map(item => item.name),
      axisLabel: {
        color: '#aaa',
        fontSize: getFontSize(12),
        rotate: 22
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.3)'
        }
      }
    },
    yAxis: {
      name: '空气质量指数',
      nameTextStyle: {
        color: '#aaa',
        fontSize: getFontSize(10),
        padding: [0, -10, 5, 0]
      },
      type: 'value',
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
        name: 'AQI (CN)',
        type: 'bar',
        data: airQualityList.map(item => item.aqi),
        barMaxWidth: 28,
        label: {
          show: true,
          position: 'top',
          color: '#00d4ff',
          fontSize: getFontSize(12),
          formatter: (params: any) => {
            const aqi = params.value ?? 0
            let { aqiLevel, richTextKey } = getAirQualityLevel(aqi)
            return `${params.value} {${richTextKey}|${aqiLevel}}`
          },
          textStyle: {
            rich: {
              Good: {
                color: 'rgba(0,228,0, 0.8)'
              },
              Fair: {
                color: 'rgba(255,255,0, 0.8)'
              },
              Unhealthy: {
                color: 'rgba(255,126,0, 0.8)'
              },
              VeryUnhealthy: {
                color: 'rgba(255,0,0, 0.8)'
              },
              Hazardous: {
                color: 'rgba(153,0,76, 0.8)'
              },
              Extreme: {
                color: 'rgba(126,0,35, 0.8)'
              }
            }
          }
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00d4ff' },
            { offset: 1, color: '#0066cc' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00f0ff' },
              { offset: 1, color: '#0088ee' }
            ])
          }
        }
      },
      {
        name: 'PM2.5',
        type: 'bar',
        data: airQualityList.map(item => item.pm25),
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: getFontSize(12)
        },
        barMaxWidth: 28,
        itemStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }

  chart?.setOption(option)
}
onMounted(() => {
  chart = echarts.init(chartRef.value)
  renderChart([], true)
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  chart?.resize()
}

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
defineExpose({
  renderChart
})
</script>

<style scoped>
.visitor-chart-container {
  width: 100%;
  height: 100%;
  padding: 0.1rem;
  position: relative;
  background: transparent;
}

.chart-wrapper {
  width: 100%;
  height: calc(100% - 0.3rem);
}
</style>
