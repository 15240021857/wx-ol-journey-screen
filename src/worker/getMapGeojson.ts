// import { ungzip } from 'pako'
let topoOpenjson: any = null

let isProd = false
self.onmessage = async e => {
  const { type, data } = e.data
  console.log('onmessage', data)
  if (type === 'init') {
    isProd = data.isProd
  }
  if (type === 'getTopojsonMap') {
    await loadTopoJson()
    const regionTopoMap = getAllRegionGeojson()
    self.postMessage({
      type: 'getTopojsonMap',
      data: regionTopoMap
    })
  }
}
// const decompressGzip = (buf: ArrayBuffer): string => {
//   const u8 = new Uint8Array(buf)
//   // 校验gzip魔数头 0x1F 0x8B
//   if (u8[0] !== 0x1f || u8[1] !== 0x8b) throw new Error('非gzip文件')
//   const raw = ungzip(u8)
//   return new TextDecoder('utf-8').decode(raw)
// }
const loadTopoJson = async () => {
  if (topoOpenjson) return topoOpenjson
  let res: any
  console.log('isProd=====================================', isProd)

  // if (isProd) {
  //   res = await fetch('/topoOpen.json.gz')
  // } else {
  res = await fetch('/topoOpen.json')
  // }
  if (!res.ok) throw new Error('not ok')
  // if (isProd) {
  //   const buf = await res.arrayBuffer()
  //   const jsonStr = decompressGzip(buf)
  //   console.log('解压后文本长度：', jsonStr.length)
  //   topoOpenjson = JSON.parse(jsonStr)
  // } else {
  topoOpenjson = await res.json()
  // }

  return topoOpenjson
}
const getAllRegionGeojson = () => {
  let regionTopoMap = new Map<string, any>()
  regionTopoMap.clear()
  const setRegionMap = (item: any) => {
    regionTopoMap.set(item.treeId, item)
    if (item.children) {
      const childMap = new Map(Object.entries(item.children))
      regionTopoMap = new Map([...regionTopoMap, ...childMap])
      for (const child of childMap.values()) {
        setRegionMap(child)
      }
    }
  }
  setRegionMap(topoOpenjson)
  return regionTopoMap
}
