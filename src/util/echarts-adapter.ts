const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

export const getFontSize = (baseSize: number): number => {
  const scaleX = window.innerWidth / DESIGN_WIDTH
  const scaleY = window.innerHeight / DESIGN_HEIGHT
  const scale = Math.min(scaleX, scaleY)
  return Math.max(baseSize * scale, 10)
}

export const getIconScale = (baseScale: number): number => {
  const scaleX = window.innerWidth / DESIGN_WIDTH
  const scaleY = window.innerHeight / DESIGN_HEIGHT
  const scale = Math.min(scaleX, scaleY)
  return Math.max(baseScale * scale, 0.3)
}
export const getMapStyleOffset = (baseOffset: number): number => {
  return Math.min(getIconScale(baseOffset), 26)
}
