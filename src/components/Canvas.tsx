import { Box, Paper } from '@mui/material'
import { Canvas, Circle, FabricImage, Line, PencilBrush, Polygon } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import Export from './Export'
import useStore, { type BrushStroke } from '../store/useStore'
import { alpha } from '@mui/system'
import { BackButton } from './Buttons'
import SuccessAlert, { ErrorExportAlert } from './Alert'
import useExport from '../hooks/useExport'
import type { TEvent } from '../EventTypeDefs'
import { v4 as uuidv4 } from 'uuid'

const CanvasApp = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const imageURL = useStore((state) => state.imageURL)
  const tool = useStore((state) => state.tool)
  const setPolygons = useStore((state) => state.setPolygons)
  const polygons = useStore((state) => state.polygons)
  const labels = useStore((state) => state.labels)
  const chosenLabel = useStore((state) => state.chosenLabel)
  const setImage = useStore((state) => state.setImage)
  const image = useStore((state) => state.image)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [imageBounds, setImageBounds] = useState<{
    left: number
    top: number
    right: number
    bottom: number
  } | null>(null)
  const brushSize = useStore((state) => state.brushSize)
  const brushStrokes = useStore((state) => state.brushStrokes)
  const setBrushStrokes = useStore((state) => state.setBrushStrokes)
  // const undoBrushStroke = useStore((state) => state.undoBrushStroke)

  const [actionHistory, setActionHistory] = useState<any[][]>([])
  const { handleExport, showSuccessAlert, showFailExportAlert } = useExport(
    labels,
    polygons,
    image
  )

  const onBackClick = () => {
    const lastStroke = brushStrokes[brushStrokes.length - 1]
    if (lastStroke) {
      setBrushStrokes((prev) =>
        prev.filter((stroke) => stroke.id !== lastStroke.id)
      )
      canvas?.remove(lastStroke.object) // Remove the stroke from the canvas
    }

    // if (actionHistory.length === 0) return
    // const lastAction = actionHistory[actionHistory.length - 1]
    // for (const object of lastAction) {
    //   canvas?.remove(object)
    // }
    // setActionHistory((prevHistory) => prevHistory.slice(0, -1))
    // canvas?.renderAll()
  }

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
    if (!imageURL || !canvasRef.current) return

    FabricImage.fromURL(imageURL)
      .then((img) => {
        if (!canvas) return

        const canvasWidth = canvas.getWidth()
        const canvasHeight = canvas.getHeight()

        const imgWidth = img.width
        const imgHeight = img.height

        const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)
        img.scale(scale)

        canvas.clear() // remove previous images
        setPoints([]) // reset the points
        canvas.add(img)
        canvas.centerObject(img)
        img.setCoords()

        img.selectable = false
        img.hoverCursor = 'default'
        canvas.renderAll()

        setImageBounds({
          left: img.left,
          top: img.top,
          right: img.left + img.getScaledWidth(),
          bottom: img.top + img.getScaledHeight()
        })
        setImage({
          height: img.getScaledHeight(),
          width: img.getScaledWidth()
        })
      })
      .catch((error) => console.error('Failed to load image:', error))
  }, [imageURL, canvas, setImage])

  // Handle tool change (Polygon tool)
  useEffect(() => {
    if (tool === 'polygon' && canvas && chosenLabel && imageURL) {
      let tempLine: Line | null = null

      const onMouseDown = (event: TEvent) => {
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
            left: x - 3,
            top: y - 3,
            selectable: false,
            hoverCursor: 'default',
            evented: false,
            hasControls: false
          })
          canvas?.add(dot)

          setPoints((prevPoints) => [...prevPoints, { x, y }])

          // Workaround the polygon for undo button
          const isPolygonBefore =
            actionHistory.length > 1 &&
            actionHistory[actionHistory.length - 1][0].type === 'polygon'

          if (actionHistory.length === 0 || isPolygonBefore) {
            setActionHistory((prevHistory) => [...prevHistory, [dot]])
          }

          // If there's a previous point, draw a line connecting it to the new point
          if (points.length > 0) {
            const lastPoint = points[points.length - 1]
            tempLine = new Line([lastPoint.x, lastPoint.y, x, y], {
              stroke: chosenLabel?.color,
              strokeWidth: 2,
              selectable: false,
              hoverCursor: 'default',
              evented: false,
              hasControls: false
            })
            canvas?.add(tempLine)
            setActionHistory((prevHistory) => [...prevHistory, [dot, tempLine]])
          }
        }
      }

      const onMouseMove = (event: TEvent) => {
        if (!tempLine || points.length === 0) return
        const pointer = canvas?.getScenePoint(event.e)
        if (pointer) {
          const { x, y } = pointer

          tempLine.set({ x2: x, y2: y }) // Update the line end point to current mouse position
          canvas?.renderAll()
        }
      }

      // If the first point is clicked again, finalize the polygon
      const onFirstDotClick = (event: TEvent) => {
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
            setActionHistory((prevHistory) => [...prevHistory, [polygon]])

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
  }, [
    tool,
    points,
    canvas,
    chosenLabel,
    imageURL,
    imageBounds,
    setPolygons,
    actionHistory
  ])

  useEffect(() => {
    if (tool && canvas && chosenLabel && imageURL) {
      canvas.isDrawingMode = true
      canvas.freeDrawingBrush = new PencilBrush(canvas)
      canvas.freeDrawingBrush.width = brushSize
      canvas.freeDrawingBrush.color = chosenLabel.color
      canvas.freeDrawingBrush.limitedToCanvasSize = true

      const onPathCreated = (event: TEvent) => {
        const brushStroke = event.path

        const strokeData: BrushStroke = {
          id: uuidv4(),
          labelId: chosenLabel.id,
          points: brushStroke.path.map((point: XY) => ({
            x: point.x,
            y: point.y
          })),
          object: brushStroke,
          timestamp: Date.now()
        }

        setBrushStrokes((prev: BrushStroke[]) => [...prev, strokeData])
        console.log('brushStroke', brushStroke)
      }
      console.log('brushStrokes', brushStrokes)

      canvas.on('mouse:move', (event) => {
        const pointer = canvas.getScenePoint(event.e)
        if (pointer && imageBounds) {
          const { x, y } = pointer
          if (
            x < imageBounds.left ||
            x > imageBounds.right ||
            y < imageBounds.top ||
            y > imageBounds.bottom
          ) {
            canvas.isDrawingMode = false
          } else {
            canvas.isDrawingMode = true
          }
        }
      })

      // TODO move to types
      interface XY {
        x: number
        y: number
      }

      // Store brush strokes with class ID

      canvas.on('path:created', onPathCreated)

      return () => {
        canvas.isDrawingMode = false
        canvas.off('path:created', onPathCreated)
      }
    }
  }, [
    tool,
    canvas,
    chosenLabel,
    imageBounds,
    imageURL,
    brushSize,
    setBrushStrokes
  ])

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
      <Box
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <canvas id="canvas" ref={canvasRef} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <BackButton
          title="Undo"
          ariaLabel="undo"
          onClick={onBackClick}
          // disabled={actionHistory?.length === 0}
          disabled={false}
        />
        <Export onClick={handleExport} />
      </Box>

      {showSuccessAlert && <SuccessAlert />}
      {showFailExportAlert && <ErrorExportAlert />}
    </Paper>
  )
}

export default CanvasApp
