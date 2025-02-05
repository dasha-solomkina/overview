import { useState } from 'react'
import { validateCOCOJSON } from '../services/validateCoco'
import type { LabelProps, Polygon, Image } from '../store/useStore'
import generateCocoJson from '../utils/generateCocoJson'

const useExport = (
  labels: LabelProps[],
  polygons: Polygon[],
  image?: Image
) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showFailExportAlert, setShowFailExportAlert] = useState(false)

  const handleExport = async () => {
    if (!image) return

    const cocoJSON = generateCocoJson(labels, image, polygons)

    console.log('Generated COCO JSON:', cocoJSON)

    const validationResult = await validateCOCOJSON(cocoJSON)
    console.log('Validation Result:', validationResult)

    const download = (cocoJSON: object) => {
      const blob = new Blob([JSON.stringify(cocoJSON, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'coco_data.json'
      link.click()
      URL.revokeObjectURL(url)
    }

    if (validationResult.message === 'Success') {
      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)

      download(cocoJSON)
    } else {
      setShowFailExportAlert(true)
      setTimeout(() => {
        setShowFailExportAlert(false)
      }, 3000)
    }
  }

  return {
    handleExport,
    showSuccessAlert,
    showFailExportAlert
  }
}

export default useExport
