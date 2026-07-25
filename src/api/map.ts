import { patchZero } from '@/util'

// 获取阿里云datav的geojson
export const getAliyunGeojson = (adcode: string) => {
  const fullAdcode = patchZero(adcode)
  return fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${fullAdcode}_full.json`)
    .then(res => res.json())
    .then(data => data)
}
