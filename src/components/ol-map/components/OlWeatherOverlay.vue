<script setup lang="ts">
import { ScenicDataItem } from '@/type/weather'
import { getYrIcon } from '../utils/hefeng-weather-icon'
import { useWeatherUtil } from '@/hooks/useWeatherUtil'
const { getAllWarningHtmlText, getAqiCategoryHtmlText, getVisMap } = useWeatherUtil()

withDefaults(
  defineProps<{
    // 弹出层数据
    data: ScenicDataItem
    // 弹出层坐标
    popupStyle?: { left: string; top: string }
  }>(),
  {
    popupStyle: () => {
      return {
        top: '0px',
        left: '0px'
      }
    }
  }
)
const emits = defineEmits<{
  (e: 'close'): void
  (e: 'openDetailDialog', data: ScenicDataItem): void
}>()
const closePopup = () => {
  emits('close')
}
// 打开详情弹窗
const openDetailDialog = (data: ScenicDataItem) => {
  emits('openDetailDialog', data)
}
const getVisHtmlText = (visNum: number | string) => {
  const visMap = getVisMap(visNum)
  if (!visMap) return ''
  return `<span style="color: ${visMap?.color || ''};">${visMap?.name || ''}</span>`
}
</script>

<template>
  <div v-if="data" class="weather-detail-popup">
    <div class="popup-glow"></div>
    <div class="popup-header">
      <span class="popup-icon">
        <img src="@/assets/img/scenic0204.png" width="36px" height="36px" alt="" srcset="" />
      </span>
      <div class="popup-right">
        <span class="popup-title">{{ data.name }}</span>
        <div class="popup-base">
          <span>{{ data.adm1 || '' }}</span>
          <span>{{ data.adm2 || '' }}</span>
        </div>
      </div>
      <span class="popup-close" @click="closePopup">×</span>
    </div>
    <div class="popup-content">
      <div class="temp-info">
        <div class="temp-left">
          <img
            :src="`/icons/yr-weather/${getYrIcon(data?.nowWeather?.icon || '')}.png`"
            width="50px"
            height="50px"
            alt=""
            srcset=""
          />
          <span class="weather-text">{{ data?.nowWeather?.text }}</span>
        </div>

        <span class="temp-warpper">
          <span class="temp-text">{{ data?.nowWeather?.temp }}°C</span>
          <el-divider direction="vertical" />
          <span class="feellike-item">
            <img src="@/assets/img/feelLike.png" width="26px" height="26px" alt="" srcset="" />
            <span class="feellike-text">{{ data?.nowWeather?.feelsLike }}°C</span>
          </span>
          <!-- <el-divider direction="vertical" />
          <span>
            <img src="/icons/weather/warn-icon.svg" alt="warn-icon" width="22" />
          </span> -->
        </span>
      </div>
      <div class="weather-detail-grid">
        <div class="detail-item">
          <span class="detail-label">风向/风级</span>
          <span class="detail-value"
            >{{ data?.nowWeather?.windDir }}{{ data?.nowWeather?.windScale }}级</span
          >
        </div>
        <div class="detail-item">
          <span class="detail-label">湿度</span>
          <span class="detail-value">{{ data?.nowWeather?.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">气压</span>
          <span class="detail-value">{{ data?.nowWeather?.pressure || '' }}hPa</span>
        </div>
        <!-- <div class="detail-item">
          <span class="detail-label">紫外线</span>
          <span class="detail-value">{{ data?.nowWeather?.vis || '' }}km</span>
        </div> -->
        <div class="detail-item">
          <span class="detail-label">空气质量</span>
          <span class="detail-value" v-html="getAqiCategoryHtmlText(data?.airquality || {})">
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">能见度</span>
          <span class="detail-value">
            <span>{{ data?.nowWeather?.vis || '' }}km</span>
            <span v-html="getVisHtmlText(data?.nowWeather?.vis || '')"></span>
          </span>
        </div>

        <div class="detail-item">
          <span class="detail-label">预警</span>
          <span
            v-if="data?.warning?.length > 0"
            class="detail-value clickable"
            :title="data?.warning?.[0]?.headline || ''"
            @click="openDetailDialog(data)"
          >
            <span v-html="getAllWarningHtmlText(data?.warning || [])"></span>
            <img src="/icons/weather/warn-icon.svg" alt="warn-icon" width="16px" />
          </span>
          <span v-else class="green-text detail-value">无</span>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" link @click="openDetailDialog(data)">详情</el-button>
        <!-- <el-button type="default" color="#eee" link @click="closePopup">关闭</el-button> -->
      </div>
      <!-- <div
        v-if="data.warning"
        class="warning-item"
        :style="{ borderColor: getWarningColor(data.warning) }"
      >
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">{{ getWarningLevel(data.warning) }}</span>
      </div>
      <div class="detail-desc">{{ data.details }}</div> -->
    </div>
    <!-- <div class="popup-corner tl"></div>
    <div class="popup-corner tr"></div>
    <div class="popup-corner bl"></div>
    <div class="popup-corner br"></div> -->
  </div>
</template>

<style scoped lang="scss">
.weather-detail-popup {
  // position: absolute;
  background: linear-gradient(135deg, rgba(10, 30, 60, 0.98) 0%, rgba(5, 20, 40, 0.98) 100%);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: 12px;
  padding: 0.15rem;
  width: 3.8rem;
  // max-width: 2.8rem;
  box-shadow:
    0 0 30px rgba(0, 200, 255, 0.2),
    0 0 60px rgba(0, 200, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  z-index: 1000;
  animation: popupFadeIn 0.3s ease;
  overflow: hidden;
}

.popup-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(ellipse at 30% 30%, rgba(0, 200, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
  animation: glowFun 6s ease infinite;
}
@keyframes glowFun {
  0%,
  100% {
    transform: translate(0, 0);
  }
  // 25% {
  //   transform: translate(0, 25%);
  // }
  50% {
    transform: translate(25%, 25%);
  }
  // 75% {
  //   transform: translate(25%, 0);
  // }
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 0.08rem;
  margin-bottom: 0.12rem;
  padding-bottom: 0.1rem;
  border-bottom: 1px solid rgba(0, 200, 255, 0.15);
  position: relative;
  z-index: 1;
}

.popup-icon {
  font-size: 0.24rem;
}

.popup-title {
  font-size: 0.16rem;
  color: #00d4ff;
  font-weight: 600;
}
.popup-right {
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.06rem;
  color: #fff;
}
.popup-base {
  font-size: 0.12rem;
  color: #ccc;
  display: flex;
  flex-flow: row;
  gap: 0.06rem;
}

.popup-close {
  font-size: 0.22rem;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
  line-height: 1;
  align-self: flex-start;
}

.popup-close:hover {
  color: #fff;
}

.popup-content {
  position: relative;
  z-index: 1;
}
.footer {
  padding: 0.1rem 0;
  border-top: 1px solid rgba(0, 200, 255, 0.15);
  .el-button + .el-button {
    margin-left: 0.08rem;
  }
}

.temp-info {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  gap: 0.22rem;
  color: #fff;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.12rem;
  text-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
  .temp-left {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    gap: 0.06rem;
  }
  .weather-text {
    font-size: 0.18rem;
    color: #00d4ff;
    font-weight: 600;
  }
  .temp-text {
    font-size: 0.24rem;
    color: #fff;
    font-weight: 600;
  }
  .temp-warpper {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    gap: 0.06rem;
    font-weight: normal;
  }
  .feellike-item {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: flex-end;
    .feellike-text {
      color: #eee;
    }
  }
}

.weather-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.06rem;
  margin-bottom: 0.1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  padding: 0.06rem;
  background: rgba(0, 100, 200, 0.1);
  border-radius: 6px;
}

.detail-label {
  font-size: 0.12rem;
  color: var(--main-text-color);
  margin-bottom: 0.02rem;
}

.detail-value {
  font-size: 0.12rem;
  color: #fff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.02rem;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 0.06rem;
  padding: 0.06rem 0.08rem;
  margin-bottom: 0.08rem;
  background: rgba(255, 100, 100, 0.1);
  border-left: 3px solid;
  border-radius: 4px;
  animation: warningPulse 2s ease-in-out infinite;
}

@keyframes warningPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.warning-icon {
  font-size: 0.14rem;
}

.warning-text {
  font-size: 0.11rem;
  color: #ff6b6b;
  font-weight: 600;
}

.detail-desc {
  font-size: 0.1rem;
  color: #888;
  line-height: 1.5;
}

.popup-corner {
  position: absolute;
  width: 0.15rem;
  height: 0.15rem;
  border: 2px solid rgba(0, 200, 255, 0.5);
}

.popup-corner.tl {
  top: 0.05rem;
  left: 0.05rem;
  border-right: none;
  border-bottom: none;
}

.popup-corner.tr {
  top: 0.05rem;
  right: 0.05rem;
  border-left: none;
  border-bottom: none;
}

.popup-corner.bl {
  bottom: 0.05rem;
  left: 0.05rem;
  border-right: none;
  border-top: none;
}

.popup-corner.br {
  bottom: 0.05rem;
  right: 0.05rem;
  border-left: none;
  border-top: none;
}
</style>
