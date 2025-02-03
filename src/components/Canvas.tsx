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
  const chosenLabel = useStore((state) => state.chosenLabel)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [lines, setLines] = useState<Line[]>([]) // To store the temporary lines

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
      })
      .catch((error) => console.error('Failed to load image:', error))
  }, [image, canvas])

  // Handle tool change (Polygon tool)
  useEffect(() => {
    if (tool === 'polygon' && canvas && chosenLabel) {
      let tempLine: Line | null = null

      const onMouseDown = (event: any) => {
        const pointer = canvas?.getScenePoint(event.e)
        if (pointer) {
          const { x, y } = pointer
          console.log(points)

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
            setLines((prevLines) => [...prevLines, tempLine]) // Store line
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

          if (distance < 10) {
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
            canvas?.add(polygon)

            console.log(points)

            // Reset points and lines after creating the polygon
            setPoints([])
            setLines([])
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
  }, [tool, points, canvas, chosenLabel])

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
