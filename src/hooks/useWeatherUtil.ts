import { certaintyMap, severityMap, urgencyMap, visMap } from '@/util/dict'

// 天气工具hooks
export const useWeatherUtil = () => {
  // 获取所有预警信息的html文本 带颜色
  const getAllWarningHtmlText = (warning: any[]) => {
    if (!warning || warning.length === 0) return ''
    const warningText = warning
      .map(item => {
        const { eventName, color } = item || {}
        const colorStr = `rgba(${color?.red || 0}, ${color?.green || 0}, ${color?.blue || 0}, ${color?.alpha || 0})`
        return `<span style="color: ${colorStr}">${eventName}</span>`
      })
      .join('')
    console.log('warningText==', warningText)

    return warningText
  }
  const getAqiCategoryHtmlText = (airquality: any) => {
    if (!airquality) return ''
    const { aqi, category, color } = airquality || {}
    const colorStr = `rgba(${color?.red || 0}, ${color?.green || 0}, ${color?.blue || 0}, ${color?.alpha || 0})`
    return `<span>${aqi || ''}</span><span style="color: ${colorStr}">${category || ''}</span>`
  }
  // 获取能见度等级和颜色
  const getVisMap = (visNum: number | string): { name: string; color: string } | null => {
    const vis = Number(visNum) || 0
    let visLevel: keyof typeof visMap
    if (vis >= 10) {
      visLevel = 1
    } else if (vis >= 2) {
      visLevel = 2
    } else if (vis >= 1) {
      visLevel = 3
    } else if (vis >= 0.5) {
      visLevel = 4
    } else if (vis >= 0.05) {
      visLevel = 5
    } else {
      visLevel = 6
    }
    return visMap[visLevel] || null
  }
  //   获取预警严重程度
  const getWarnSeverityHtmlText = (severity: keyof typeof severityMap) => {
    if (!severity) return '-'
    const severityInfo = severityMap[severity] || {}
    const { name, color } = severityInfo
    return `<span style="color: ${color}">${name}</span>`
  }
  // 获取预警确定性
  const getCertaintyHtmlText = (certainty: keyof typeof certaintyMap) => {
    if (!certainty) return '-'
    const certaintyInfo = certaintyMap[certainty] || {}
    const { name, color } = certaintyInfo
    return `<span style="color: ${color}">${name}</span>`
  }
  // 获取预警紧迫性
  const getUrgencyHtmlText = (urgency: keyof typeof urgencyMap) => {
    if (!urgency) return '-'
    const urgencyInfo = urgencyMap[urgency] || {}
    const { name, color } = urgencyInfo
    return `<span style="color: ${color}">${name}</span>`
  }
  return {
    getAllWarningHtmlText,
    getAqiCategoryHtmlText,
    getVisMap,
    getWarnSeverityHtmlText,
    getCertaintyHtmlText,
    getUrgencyHtmlText
  }
}
