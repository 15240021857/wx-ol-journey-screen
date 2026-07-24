import { fromLonLat, toLonLat } from 'ol/proj'
import coordtransform from 'coordtransform'
import { Geometry } from 'ol/geom'
import GeoJSON from 'ol/format/GeoJSON'

// type GeojsonGeometry = GeoJSON.Polygon | GeoJSON.MultiPolygon | GeoJSON.LineString | GeoJSON.Point
export class OlUtil {
  // wgs84 经纬度 转为 EPSG3857 坐标
  static wgs84ToEpsg3857(wgs84: number[]): number[] {
    const [lng, lat] = wgs84
    return fromLonLat([lng, lat])
  }
  // EPSG3857 坐标 转为 wgs84经纬度
  static epsg3857ToWgs84(epsg3857: number[]): number[] {
    const [lng, lat] = epsg3857
    return toLonLat([lng, lat])
  }
  // gcj02火星坐标转为wgs84
  static gcj02ToWgs84(gcj02: number[], digit = 6): number[] {
    const [lng, lat] = gcj02
    const wgs84 = coordtransform.gcj02towgs84(lng, lat).map((item: number) => +item.toFixed(digit))
    return wgs84
  }
  static wgs84ToGcj02(wgs84: number[], digit = 6): number[] {
    const [lng, lat] = wgs84
    return coordtransform.wgs84togcj02(lng, lat).map((item: number) => Number(item.toFixed(digit)))
  }
  // 转换为wgs84坐标 的几何对象
  static gcj02ToWgs84Geometry(geometry: any): Geometry {
    const geometryType = geometry.type
    let coordinates = JSON.parse(JSON.stringify(geometry.coordinates))
    switch (geometryType) {
      case 'Polygon':
        coordinates = coordinates.map((polygon: number[][]) => {
          return polygon.map((ring: number[]) => this.gcj02ToWgs84(ring))
        })
        break
      case 'MultiPolygon':
        coordinates = coordinates.map((polygonArr: number[][][]) => {
          return polygonArr.map((polygon: number[][]) => {
            return polygon.map((ring: number[]) => this.gcj02ToWgs84(ring))
          })
        })
        break
      //   case 'LineString':
      //     return {
      //       ...geometry,
      //       coordinates: geometry.coordinates.map((point: number[]) => this.gcj02ToWgs84(point))
      //     }
      //   case 'Point':
      //     return {
      //       ...geometry,
      //       coordinates: this.gcj02ToWgs84(geometry.coordinates)
      //     }
      default:
        return geometry
    }
    return {
      ...geometry,
      coordinates
    }
  }
}
