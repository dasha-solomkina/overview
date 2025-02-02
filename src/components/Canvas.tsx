import { Paper } from '@mui/material'
import { Canvas, FabricImage } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import Export from './Export'
// import * as fabric from 'fabric'

interface CanvasProps {
  image: string | null
}

const CanvasApp = ({ image }: CanvasProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvas, setCanvas] = useState<Canvas | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const initCanvas = new Canvas(canvasRef.current, {
        width,
        height
      })

      initCanvas.backgroundColor = '#e5e5e5'
      initCanvas.renderAll()

      setCanvas(initCanvas)

      return () => {
        initCanvas.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (!image || !canvasRef.current) return

    FabricImage.fromURL(image)
      .then((img) => {
        if (!canvas) return

        const canvasWidth = canvas.getWidth()
        const canvasHeight = canvas.getHeight()

        const imgWidth = img.width
        const imgHeight = img.height

        const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)
        img.scale(scale)

        canvas.clear() // remove previous images
        canvas.add(img)
        canvas.centerObject(img)
        img.setCoords()
        canvas.renderAll()
      })
      .catch((error) => console.error('Failed to load image:', error))
  }, [image, canvas])

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        borderRadius: 2,
        padding: 2,
        gap: 3
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <canvas id="canvas" ref={canvasRef} />
      </div>
      <Export />
    </Paper>
  )
}

export default CanvasApp
