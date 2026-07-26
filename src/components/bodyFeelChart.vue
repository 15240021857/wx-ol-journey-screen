<template>
  <div class="visitor-chart-container glass-card">
    <div class="card-title">景点体感温度情况</div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { loadingConfig } from '@/directive/loadingSetting'
import { getFontSize } from '@/util/echarts-adapter'

interface BodyFeelItem {
  name: string
  bodyFeel: number
  temp: number
}
const chartRef = ref(null)
let chart: echarts.ECharts | null = null
const curLoading = ref(true)
const renderChart = (bodyFeelList: BodyFeelItem[], firstRender: boolean = false) => {
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
        const tempStr = params
          .map((item: any) => {
            return `${item.marker} ${item.seriesName}: ${item.value}℃`
          })
          .join('<br/>')
        return `${scenicStr}${tempStr}`
      }
    },
    legend: {
      data: ['体感温度', '景点温度'],
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
      data: bodyFeelList.map(item => item.name),
      axisLabel: {
        color: '#aaa',
        fontSize: getFontSize(12),
        rotate: 26
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.3)'
        }
      }
    },
    yAxis: {
      name: '温度 ℃',
      nameTextStyle: {
        color: '#aaa',
        fontSize: getFontSize(12),
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
        name: '体感温度',
        type: 'bar',
        data: bodyFeelList.map(item => item.bodyFeel),
        label: {
          show: true,
          position: 'top',
          color: '#00d4ff',
          fontSize: getFontSize(12)
        },
        barMaxWidth: 28,
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
        name: '景点温度',
        type: 'bar',
        data: bodyFeelList.map(item => item.temp),
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
  height: 100%;
}
</style>
