//   控制并发获取 默认最多一次3个请求
export const requestConcurrency = async (reqArr: (() => Promise<any>)[], maxConcurrency = 3) => {
  // 分批请求
  const funGroupArr: (() => Promise<any>)[][] = []
  // 分批处理返回数据
  const resGroupArr: any[] = []
  let colIndex = 0
  for (let i = 0; i < reqArr.length; i++) {
    if (!funGroupArr[colIndex]) {
      funGroupArr[colIndex] = []
    }

    if (funGroupArr[colIndex]?.length >= maxConcurrency) {
      colIndex++
      funGroupArr[colIndex] = []
    }
    funGroupArr[colIndex].push(reqArr[i])
  }
  for (const funArr of funGroupArr) {
    const promiseArr = funArr.map(fun => fun())
    const resArr = await Promise.all(promiseArr)
    // 处理返回数据
    for (let i = 0; i < resArr.length; i++) {
      const res = resArr[i]
      const fun = funArr[i]
      const originIndex = reqArr.indexOf(fun)
      resGroupArr[originIndex] = res
    }
  }
  return resGroupArr
}
// 获取当前日期周文本
export const getWeekDateText = (date: Date | string) => {
  let curDate: Date
  if (typeof date === 'string') {
    curDate = new Date(date)
  } else {
    curDate = date
  }

  const today = new Date()
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  const tomorrowKey = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`

  const dateKey = `${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDate()}`

  if (dateKey === todayKey) {
    return '今天'
  }
  if (dateKey === tomorrowKey) {
    return '明天'
  }

  const weekMap = ['日', '一', '二', '三', '四', '五', '六']
  return `周${weekMap[curDate.getDay()]}`
}
// 对象根据prop取值，兼容带.嵌套的prop
export const getValueByPropPath = (obj: any, propPath: string) => {
  if (!obj) {
    return ''
  }
  console.log(obj, propPath)

  const props = propPath.split('.')
  let cur = obj
  for (const prop of props) {
    cur = cur[prop]
  }
  return cur || ''
}
