import { onUnmounted } from 'vue'

// 防抖，带是否立即执行
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  options: { delay?: number; immediate?: boolean }
) {
  const { delay = 1000 } = options
  let timer: number | null = null
  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  const debounceFun = (...args: Parameters<T>) => {
    // 立即执行处理
    // if (!timer) {
    //   fn(...args)
    // }
    cancel()
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
  onUnmounted(() => {
    cancel()
  })
  return {
    debounceFun
  }
}

// 节流
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  options: { delay?: number; immediate?: boolean }
) {
  const { delay = 1000 } = options
  let lastTime = 0
  const throttleFun = (...args: Parameters<T>) => {
    // 立即执行处理
    const now = Date.now()
    const remaining = delay - (now - lastTime)
    if (remaining <= 0) {
      fn(...args)
      lastTime = now
    }
  }
  return {
    throttleFun
  }
}
