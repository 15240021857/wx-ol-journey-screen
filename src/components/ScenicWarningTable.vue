<template>
  <div class="visitor-chart-container glass-card">
    <div class="card-title">当前景点告警</div>
    <div class="chart-wrapper">
      <el-table
        class="warning-table"
        :data="warningList"
        height="225"
        empty-text="暂无告警"
        ref="tableRef"
        :row-style="{
          background: 'transparent',
          height: '63px',
          cursor: 'pointer'
        }"
        @row-click="handleRowClick"
        @mouseenter="stopAutoScroll"
        @mouseleave="startAutoScrollTable"
      >
        <template #empty>
          <el-empty class="warning-empty" description="暂无预警">
            <template #image>
              <Icon icon="line-md:coffee-half-empty-twotone-loop" height="18px" />
            </template>
          </el-empty>
        </template>

        <el-table-column prop="name" label="景点名称" width="100" />
        <el-table-column prop="eventName" label="类型" width="55">
          <template #default="scope">
            <div
              :style="{
                color: scope.row.color,
                'font-weight': 'bold'
              }"
              class="warning-type-icon"
            >
              {{ scope.row.eventName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="headline" label="告警内容" width="150">
          <template #default="scope">
            <span :title="scope.row.description" style="text-decoration: underline">{{
              scope.row.headline
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="effectiveTime" label="生效时间" width="150">
          <template #default="scope">
            {{ dayjs(scope.row.effectiveTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <OlWeatherDialog ref="olWeatherDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ScenicDataItem, WarningTableItem } from '@/type/weather'
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'
import dayjs from 'dayjs'
import { Icon } from '@iconify/vue'
import { useScenicStore } from '@/store/modules/useScenicStore'
import OlWeatherDialog from '@/components/ol-map/components/OlWeatherDialog.vue'

const warningList = ref<WarningTableItem[]>([])
let tableTimer: number | null = null
const setTableData = (data: WarningTableItem[]) => {
  console.log('data==', data)

  warningList.value = data
  if (tableTimer) {
    clearTimeout(tableTimer)
    tableTimer = null
  }
  tableTimer = setTimeout(() => {
    startAutoScrollTable()
  }, 1000)
}

const tableRef = useTemplateRef<HTMLDivElement>('tableRef')
// 初始化表格自动滚动
const ROW_HEIGHT = 63
let scrollTimer: number | null = null
const cancelTimer = () => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
}
const getRowHeight = () => {
  const tableRoot: any = tableRef.value
  const tableRow = tableRoot?.$el.querySelector('.el-table__row') as HTMLElement
  if (tableRow) {
    return tableRow.offsetHeight
  }
  return ROW_HEIGHT
}
const startAutoScrollTable = () => {
  const tableRoot: any = tableRef.value
  const tableScrollWrapper = tableRoot?.$el.querySelector('.el-scrollbar__wrap') as HTMLElement
  const scrollView = tableScrollWrapper?.querySelector('.el-scrollbar__view') as HTMLElement
  if (tableScrollWrapper) {
    const scrollHeight = scrollView.scrollHeight
    const clientHeight = tableScrollWrapper.clientHeight

    if (scrollHeight <= clientHeight + 20) {
      console.log('够放，不用滚动')
      return
    }
    const rowHeight = getRowHeight()
    const toBottom = tableScrollWrapper.scrollTop + clientHeight >= scrollHeight - 20
    let scrollTop: number = tableScrollWrapper.scrollTop
    if (toBottom) {
      scrollTop = 0
    } else {
      scrollTop += rowHeight
    }
    tableScrollWrapper.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    })
  }
  cancelTimer()
  scrollTimer = setTimeout(() => {
    startAutoScrollTable()
  }, 3000)
}
const stopAutoScroll = () => {
  cancelTimer()
}
const scenicStore = useScenicStore()
const olWeatherDialogRef =
  useTemplateRef<InstanceType<typeof OlWeatherDialog>>('olWeatherDialogRef')
const handleRowClick = (row: WarningTableItem) => {
  const curScenicId = row.scenicId
  const curScenic = scenicStore.scenicList.find(item => item.id === curScenicId)
  if (curScenic) {
    olWeatherDialogRef.value?.openDialog(curScenic as ScenicDataItem, 'warning')
  }
}

onUnmounted(() => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
})
defineExpose({
  setTableData
})
</script>

<style scoped lang="scss">
.el-table {
  --el-table-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-text-color: #fff;
  --el-table-text-color: #00d4ff;
  --el-table-row-hover-bg-color: rgba(0, 102, 201, 0.3);
  --el-table-border-color: rgba(0, 212, 255, 0.3);
  :deep(tr) {
    background-image: linear-gradient(10deg, #0066cc 20%, #00d4ff 100%);
  }
  :deep(.cell) {
    padding: 0 6px;
  }
  :deep(.el-table__empty-text) {
    line-height: 17vh;
  }
}
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
:deep(.warning-table) {
  .el-table__empty-text {
    line-height: 5vh;
  }
}
.warning-empty {
  line-height: 0;
  :deep(.el-empty__image) {
    width: 50px;
    height: 50px;
    svg {
      fill: initial;
    }
  }
}
</style>
