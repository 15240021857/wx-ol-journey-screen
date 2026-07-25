import { getCascaderDataWithCode } from 'cn-division'
import type { RegionTreeItem } from '@/type/weather'

// 地图区域选择
export const useMapRegionOptionsOnline = () => {
  // treeId和treeData映射关系
  const regionTreeIdMap = new Map<string, RegionTreeItem>()

  // 获得区域树
  const regionTreeOptions: any[] = getCascaderDataWithCode()
  console.log('getCascaderDataWithCode!!!!!!!!!!!!!!!!!', regionTreeOptions)

  // 获得区域子节点
  const getRegionChildMapList = (adcode: string) => {
    return [] as any[]
  }
  return {
    regionTreeOptions,
    regionTreeIdMap,
    getRegionChildMapList
  }
}
