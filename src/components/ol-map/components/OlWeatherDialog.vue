<script setup lang="ts">
import { ref } from 'vue'
import { getYrIcon } from '../utils/hefeng-weather-icon'
import { regionWarningProps, ScenicDataItem } from '@/type/weather'
import { getValueByPropPath } from '@/util'
import { Icon } from '@iconify/vue'
import { dayjs } from 'element-plus'
import { useWeatherUtil } from '@/hooks/useWeatherUtil'
const { getWarnSeverityHtmlText, getCertaintyHtmlText, getUrgencyHtmlText } = useWeatherUtil()

interface weatherItem {
  name: string
  prop: string
  span?: number
  unit?: string
  prewrap?: boolean
  formatter?: (item: any, curData?: any) => string
}
const visible = ref(false)
const data = ref<ScenicDataItem>()
// 基础信息
const baseList = ref<weatherItem[]>([
  {
    name: '所属地区',
    prop: 'adm1',
    formatter(item) {
      return `${data.value?.['adm1']} ${data.value?.['adm2']}`
    }
  },
  { name: '天气', prop: 'nowWeather.text' },
  { name: '温度', prop: 'nowWeather.temp', unit: '℃' },
  { name: '体感温度', prop: 'nowWeather.feelsLike', unit: '℃' },
  { name: '湿度', prop: 'nowWeather.humidity', unit: '%' },
  {
    name: '风向/风级',
    prop: 'nowWeather.windDir',
    unit: '级',
    formatter(item) {
      const { windDir, windScale } = data.value?.nowWeather || {}
      return `${windDir} ${windScale}级`
    }
  },
  { name: '风速', prop: 'nowWeather.windSpeed', unit: 'm/s' },
  { name: '能见度', prop: 'nowWeather.vis', unit: 'km' }
])
// 空气质量
const airqualityList = ref<weatherItem[]>([
  {
    name: 'AQI (CN)',
    prop: 'airquality.aqi',
    formatter(item) {
      const { aqi, category, color } = data.value?.airquality || {}
      const colorValue = `rgba(${color?.red}, ${color?.green}, ${color?.blue}, ${color?.alpha})`
      return `${aqi} <span style="color: ${colorValue}">${category}</span>`
    }
  },
  {
    name: 'PM2.5',
    prop: 'airquality.primaryPollutant.value',
    formatter(item) {
      const pm25Data = getValueByPropPath(data.value, 'airquality.primaryPollutant')
      return pm25Data?.value ? `${pm25Data?.value || ''} ${pm25Data?.unit}` : '-'
    }
  },
  { name: '健康影响', prop: 'airquality.health.effect', span: 2 },
  { name: '普通人群', prop: 'airquality.health.advice.generalPopulation', span: 2 },
  { name: '敏感人群', prop: 'airquality.health.advice.sensitivePopulation', span: 2 }
])
const BASE_URL = import.meta.env.BASE_URL
// 预警信息
const warningItemList = ref<weatherItem[]>([
  { name: '主题', prop: 'headline', span: 2 },
  {
    name: '事件类型',
    prop: 'eventName',
    formatter(item, curData) {
      const { color, eventName } = curData || {}
      const rgbaStr = `rgba(${color?.red || 0}, ${color?.green || 0}, ${color?.blue || 0}, ${color?.alpha || 0})`
      return `<span style="color: ${rgbaStr}">${eventName}</span> <img src="${BASE_URL}/icons/weather/warn-icon.svg" alt="warn-icon" width="16px" />`
    }
  },
  {
    name: '严重程度',
    prop: 'severity',
    formatter: (item, curData) => getWarnSeverityHtmlText(curData?.severity || '')
  },
  {
    name: '紧迫程度',
    prop: 'urgency',
    formatter: (item, curData) => {
      return getUrgencyHtmlText(curData?.urgency || '')
    }
  },
  {
    name: '可信程度',
    prop: 'certainty',
    formatter: (item, curData) => getCertaintyHtmlText(curData?.certainty || '')
  },
  {
    name: '生效时间',
    prop: 'effectiveTime',
    span: 1,
    formatter: (item, curData) => {
      return dayjs(curData?.effectiveTime || '').format('YYYY-MM-DD HH:mm')
    }
  },
  {
    name: '失效时间',
    prop: 'expireTime',
    span: 1,
    formatter: (item, curData) => {
      return dayjs(curData?.expireTime || '').format('YYYY-MM-DD HH:mm')
    }
  },
  {
    name: '预计发生时间',
    prop: 'onsetTime',
    span: 2,
    formatter: (item, curData) => {
      return dayjs(curData?.onsetTime || '').format('YYYY-MM-DD HH:mm')
    }
  },
  { name: '描述', prop: 'description', span: 2 },
  { name: '触发标准', prop: 'criteria', span: 2 },
  {
    name: '行动指导',
    prop: 'instruction',
    span: 2,
    prewrap: true,
    formatter(item, curData) {
      const instruArr = curData?.instruction?.split(' ') || []
      console.log('instruArr===', instruArr)
      const instruHtmlStr = instruArr?.join('\n') || '-'
      return `<span style="white-space: pre-wrap;">${instruHtmlStr}</span>`
    }
  }
])
const isWarningDialog = ref(false)
const openDialog = (scenicData: ScenicDataItem, type: 'scenic' | 'warning' = 'scenic') => {
  visible.value = true
  isWarningDialog.value = type === 'warning'
  data.value = scenicData
}
const closeDialog = () => {
  visible.value = false
  data.value = undefined
  isWarningDialog.value = false
}
defineExpose({
  openDialog,
  closeDialog
})
</script>

<template>
  <el-dialog
    :title="data?.name || '天气详情'"
    v-model="visible"
    :modal="false"
    draggable
    modal-penetrable
    width="5rem"
    top="6vh"
    :z-index="199"
    append-to-body
    class="right-dialog"
    :lock-scroll="true"
  >
    <div class="dialog-content" style="max-height: 80vh; overflow: auto">
      <div v-if="!isWarningDialog" class="dialog-section">
        <!-- <div class="section-title">基础信息</div> -->
        <div class="section-content">
          <el-descriptions
            class="detail-container"
            title="基础信息"
            :column="2"
            size="default"
            border
            label-width="1rem"
          >
            <el-descriptions-item
              v-for="item in baseList"
              :key="item.prop"
              class-name="column-style"
            >
              <template #label>
                <div class="cell-item">{{ item.name }}</div>
              </template>
              <div v-if="item.formatter" class="item-value" v-html="item.formatter(item)"></div>
              <div v-else class="item-value">
                {{ getValueByPropPath(data, item.prop) || '-' }} {{ item.unit || '' }}
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div v-if="!isWarningDialog" class="dialog-section">
        <!-- <div class="section-title">空气质量</div> -->
        <div class="section-content">
          <el-descriptions
            class="detail-container"
            title="空气质量"
            :column="2"
            size="default"
            border
            label-width="1rem"
          >
            <el-descriptions-item
              v-for="item in airqualityList"
              :key="item.prop"
              :span="item.span || 1"
            >
              <template #label>
                <div class="cell-item">{{ item.name }}</div>
              </template>
              <div v-if="item.formatter" class="item-value" v-html="item.formatter(item)"></div>
              <div v-else class="item-value">
                {{ getValueByPropPath(data, item.prop) || '-' }}
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="dialog-section">
        <div class="section-title warn-text">
          预警信息 {{ `(${data?.warning?.length || 0}个)` }}
        </div>
        <div class="section-content">
          <template v-if="data?.warning && data?.warning?.length > 0">
            <el-descriptions
              class="detail-container warn-container"
              v-for="warnItem in data?.warning || []"
              :key="warnItem.id"
              :column="2"
              direction="horizontal"
              border
              label-width="1rem"
            >
              <el-descriptions-item
                v-for="item in warningItemList"
                :key="item.prop"
                :span="item.span || 1"
              >
                <template #label>
                  <div class="cell-item">{{ item.name }}</div>
                </template>
                <div
                  v-if="item.formatter"
                  class="item-value"
                  v-html="item.formatter(item, warnItem)"
                ></div>
                <div v-else class="item-value" :class="{ 'pre-wrap': item.prewrap }">
                  {{ getValueByPropPath(warnItem, item.prop) || '-' }}
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </template>
          <el-empty v-else class="warning-empty" description="暂无预警">
            <template #image>
              <Icon icon="line-md:coffee-half-empty-twotone-loop" />
            </template>
          </el-empty>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-section {
  margin-bottom: 0.16rem;
  .section-title {
    font-size: 0.16rem;
    font-weight: 600;
    color: #303133;
    margin-bottom: 0.1rem;
  }
}
.detail-container {
  width: 100%;
  :deep(.el-descriptions__header) {
    margin-bottom: 0.1rem;
  }
}
.warn-container {
  margin-bottom: 0.1rem;
}
.warning-empty {
  :deep(.el-empty__image) {
    width: 82px;
    svg {
      fill: initial;
    }
  }
}
.pre-wrap {
  white-space: pre-wrap;
}
.item-value {
  display: flex;
  min-width: 1.05rem;
  font-size: 0.15rem;
  line-height: 1.3em;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.05rem;
}
.cell-item {
  font-size: 0.15rem;
  width: 0.75rem;
}
.column-style {
  background-color: skyblue;
}
:deep(.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell) {
  padding: 0.08rem 0.11rem;
}
:deep(.el-descriptions__title) {
  font-size: 0.16rem;
}
</style>
