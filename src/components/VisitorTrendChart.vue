<template>
  <div class="visitor-trend-chart-container glass-card">
    <div class="card-title">本周人流量趋势</div>
    <div ref="chartRef" class="chart-wrapper"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { visitorTrendData } from '@/data/mockData'

const chartRef = ref(null)
let chart = null

onMounted(() => {
  chart = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 30, 60, 0.9)',
      borderColor: 'rgba(0, 200, 255, 0.3)',
      textStyle: {
        color: '#fff'
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
      type: 'category',
      boundaryGap: false,
      data: visitorTrendData.days,
      axisLabel: {
        color: '#aaa'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.3)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#aaa',
        formatter: '{value}'
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
        name: '人流量',
        type: 'line',
        smooth: true,
        data: visitorTrendData.visitors,
        lineStyle: {
          color: '#00d4ff',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.4)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
          ])
        },
        itemStyle: {
          color: '#00d4ff'
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderColor: '#00d4ff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 212, 255, 0.5)'
          }
        }
      }
    ]
  }

  chart.setOption(option)

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
.visitor-trend-chart-container {
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
