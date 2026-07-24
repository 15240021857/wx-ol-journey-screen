import { onMounted, onUnmounted, ref } from 'vue'

export const useUpdateTime = () => {
  const currentTime = ref('')
  const currentDate = ref('')
  const updateTime = ref('')
  let timer: number | null = null

  const updateTimeDisplay = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    currentTime.value = `${hours}:${minutes}:${seconds}`

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[now.getDay()]
    currentDate.value = `${year}-${month}-${day} ${weekDay}`

    updateTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  onMounted(() => {
    updateTimeDisplay()
    timer = setInterval(updateTimeDisplay, 1000)
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
    }
  })
  return {
    currentTime,
    currentDate,
    updateTime
  }
}
