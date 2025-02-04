import {
  calculatePolygonArea,
  generateRandomId,
  getBoundingBox
} from './calculations'
import type { LabelProps, Image, Polygon } from '../store/useStore'

const generateCocoJson = (
  labels: LabelProps[],
  image: Image,
  polygons: Polygon[]
) => {
  const categories = labels.map((label) => {
    return { supercategory: label.name, id: label.id, name: label.name }
  })

  const annotations = polygons.map((polygon) => {
    const segmentation = polygon.points.flatMap((point) => [point.x, point.y])
    const area = calculatePolygonArea(polygon.points)
    return {
      segmentation: [segmentation],
      area: area,
      iscrowd: 0,
      image_id: 1,
      bbox: getBoundingBox(polygon.points),
      category_id: polygon.labelId,
      id: generateRandomId(10)
    }
  })

  return {
    info: {
      description: 'Take-home test Overview.ai',
      url: 'https://github.com/dasha-solomkina',
      version: '1',
      year: 2025,
      contributor: 'Daria Solomkina',
      date_created: new Date().toISOString()
    },
    licenses: [
      {
        url: 'http://example.com/license',
        id: 1,
        name: 'Attribution License'
      }
    ],
    images: [
      {
        license: 1,
        file_name: 'example.jpg',
        coco_url: 'http://example.com/images/image1.jpg',
        height: image.height,
        width: image.width,
        date_captured: '2025-02-01',
        flickr_url: 'http://flickr.com/example.jpg',
        id: 1
      }
    ],
    annotations,
    categories
  }
}

export default generateCocoJson
