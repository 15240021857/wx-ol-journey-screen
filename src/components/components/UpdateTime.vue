<script setup lang="ts">
import { useUpdateTime } from '@/hooks/useUpateTime'

// 实时更新时间
const { currentTime, currentDate, updateTime } = useUpdateTime()
</script>

<template>
  <div class="time-display">
    <span class="time">{{ currentTime }}</span>
    <span class="date">{{ currentDate }}</span>
  </div>
</template>

<style scoped lang="scss">
.time-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.time {
  font-size: 0.3rem;
  color: #00d4ff;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.date {
  font-size: 0.11rem;
  color: #888;
}
</style>
