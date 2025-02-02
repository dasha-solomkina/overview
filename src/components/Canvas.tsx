import { Paper } from '@mui/material'
import { Canvas, FabricImage, Image } from 'fabric'
import { useEffect, useRef, useState } from 'react'
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
        img.set({ left: 0, top: 0, selectable: true })
        canvas?.clear() // Clear previous images before adding a new one
        canvas?.add(img)
        canvas?.renderAll()
      })
      .catch((error) => console.error('Failed to load image:', error))
  }, [image, canvas])

  return (
    <Paper
      sx={{
        display: 'flex',
        flex: 1,
        borderRadius: 2,
        padding: 2
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <canvas id="canvas" ref={canvasRef} />
      </div>
    </Paper>
  )
}

export default CanvasApp
