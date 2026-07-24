import cnTreeMap from '@/data/topoOpenMap.json'
import type { RegionTreeItem } from '@/type/weather'

// 地图区域选择
export const useMapRegionChoose = () => {
  // treeId和treeData映射关系
  const regionTreeIdMap = new Map<string, RegionTreeItem>()
  const getRegionTree = (): RegionTreeItem => {
    // 省市区 treeId映射
    cnTreeMap.forEach(item => {
      regionTreeIdMap.set(item.treeID, { ...item, children: [] })
    })
    // 挂载子节点
    cnTreeMap.forEach((item: RegionTreeItem) => {
      const parent = item.parent
      if (parent) {
        regionTreeIdMap.get(parent)?.children?.push(item)
      }
    })

    // 找children
    const getAllRegionTree = (item: RegionTreeItem): RegionTreeItem => {
      return {
        ...item,
        children: item?.children?.map((child: RegionTreeItem) => {
          const childItem = regionTreeIdMap.get(child.treeID)
          return getAllRegionTree(childItem!)
        })
      }
    }
    // 从根开始找
    const root = regionTreeIdMap.get('1')
    const regionTree = getAllRegionTree(root!)
    return regionTree
  }
  // 获得区域树
  const regionTreeOptions = getRegionTree()
  // 获得区域子节点
  const getRegionChildMapList = (treeId: string) => {
    return regionTreeIdMap.get(treeId)?.children || []
  }
  return {
    regionTreeOptions,
    regionTreeIdMap,
    getRegionChildMapList
  }
}
