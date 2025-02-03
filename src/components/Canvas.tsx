import { Paper } from '@mui/material'
import { Canvas, Circle, FabricImage, Line, Polygon } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import Export from './Export'
import useStore from '../store/useStore'
import { alpha } from '@mui/system'

const CanvasApp = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const image = useStore((state) => state.image)
  const tool = useStore((state) => state.tool)
  const setPolygons = useStore((state) => state.setPolygons)
  const chosenLabel = useStore((state) => state.chosenLabel)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [imageBounds, setImageBounds] = useState<{
    left: number
    top: number
    right: number
    bottom: number
  } | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const initCanvas = new Canvas(canvasRef.current, {
        width,
        height
      })

      initCanvas.backgroundColor = '#e5e5e5' // TODO: change to white later
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

        img.selectable = false
        img.hoverCursor = 'default'
        canvas.renderAll()
        console.log('image x', img.left)
        console.log('image y', img.top)

        setImageBounds({
          left: img.left,
          top: img.top,
          right: img.left + img.getScaledWidth(),
          bottom: img.top + img.getScaledHeight()
        })
      })
      .catch((error) => console.error('Failed to load image:', error))
  }, [image, canvas])

  // Handle tool change (Polygon tool)
  useEffect(() => {
    if (tool === 'polygon' && canvas && chosenLabel && image) {
      let tempLine: Line | null = null

      const onMouseDown = (event: any) => {
        if (!canvas || !imageBounds) return

        const pointer = canvas?.getScenePoint(event.e)
        if (pointer) {
          const { x, y } = pointer
          if (
            x < imageBounds.left ||
            x > imageBounds.right ||
            y < imageBounds.top ||
            y > imageBounds.bottom
          ) {
            return
          }

          // Create a dot at the clicked position
          const dot = new Circle({
            radius: 3,
            fill: chosenLabel?.color,
            left: x - 3, // Center the dot
            top: y - 3 // Center the dot
          })
          canvas?.add(dot)

          setPoints((prevPoints) => [...prevPoints, { x, y }])

          // If there's a previous point, draw a line connecting it to the new point
          if (points.length > 0) {
            const lastPoint = points[points.length - 1]
            tempLine = new Line([lastPoint.x, lastPoint.y, x, y], {
              stroke: chosenLabel?.color,
              strokeWidth: 2,
              selectable: false
            })
            canvas?.add(tempLine)
          }
        }
      }

      const onMouseMove = (event: any) => {
        if (!tempLine || points.length === 0) return
        const pointer = canvas?.getScenePoint(event.e)
        if (pointer) {
          const { x, y } = pointer

          tempLine.set({ x2: x, y2: y }) // Update the line end point to current mouse position
          canvas?.renderAll()
        }
      }

      // If the first point is clicked again, finalize the polygon
      const onFirstDotClick = (event: any) => {
        const pointer = canvas?.getScenePoint(event.e)
        if (pointer && points.length > 0) {
          const { x, y } = pointer

          // Check if the pointer is close to the first point
          const firstPoint = points[0]
          const distance = Math.sqrt(
            (x - firstPoint.x) ** 2 + (y - firstPoint.y) ** 2
          )

          if (distance < 8) {
            if (!imageBounds) {
              console.error('imageBounds is not defined')
              return
            }
            // Clicked near the first point, close the polygon
            const polygon = new Polygon(points, {
              fill: alpha(chosenLabel.color, 0.2),
              stroke: chosenLabel?.color,
              strokeWidth: 2,
              selectable: false,
              evented: false,
              hasControls: false,
              hoverCursor: 'default'
            })

            const newPolygon = points.map((point) => ({
              x: point.x - imageBounds.left,
              y: point.y - imageBounds.top
            }))
            setPolygons({ labelId: chosenLabel.id, points: newPolygon })

            canvas?.add(polygon)

            setPoints([])
          }
        }
      }

      canvas?.on('mouse:down', onMouseDown)
      canvas?.on('mouse:move', onMouseMove)
      canvas?.on('mouse:down', onFirstDotClick)

      // Cleanup on unmount or tool change
      return () => {
        canvas?.off('mouse:down', onMouseDown)
        canvas?.off('mouse:move', onMouseMove)
        canvas?.off('mouse:down', onFirstDotClick)
      }
    }
  }, [tool, points, canvas, chosenLabel, image, imageBounds, setPolygons])

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
