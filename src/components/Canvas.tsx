import { Box, Paper, Typography } from '@mui/material'
import { Canvas, Circle, FabricImage, Line, PencilBrush, Polygon } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import Export from './Export'
import useStore, { type BrushStroke } from '../store/useStore'
import { alpha } from '@mui/system'
import { BackButton } from './Buttons'
import SuccessAlert, { ErrorExportAlert } from './Alert'
import useExport from '../hooks/useExport'
import { v4 as uuidv4 } from 'uuid'
import type { FabricObject, TBrushEventData } from 'fabric'

interface XY {
  x: number
  y: number
}

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

  const [actionHistory, setActionHistory] = useState<FabricObject[][]>([])

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
      canvas?.remove(lastStroke.object)
    }

    if (actionHistory.length === 0) return
    const lastAction = actionHistory[actionHistory.length - 1]
    for (const object of lastAction) {
      canvas?.remove(object)
    }
    setActionHistory((prevHistory) => prevHistory.slice(0, -1))
    canvas?.renderAll()
  }

  useEffect(() => {
    if (canvasRef.current) {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const initCanvas = new Canvas(canvasRef.current, {
        width,
        height
      })

      initCanvas.backgroundColor = '#fff'
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

        canvas.clear()
        setPoints([])
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

  useEffect(() => {
    if (tool === 'polygon' && canvas && chosenLabel && imageURL) {
      let tempLine: Line | null = null

      const onMouseDown = (event: TBrushEventData) => {
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

          const isPolygonBefore =
            actionHistory.length > 1 &&
            actionHistory[actionHistory.length - 1][0].type === 'polygon'

          if (actionHistory.length === 0 || isPolygonBefore) {
            setActionHistory((prevHistory) => [...prevHistory, [dot]])
          }

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
            setActionHistory((prevHistory) => [
              ...prevHistory,
              [dot, tempLine].filter((item) => item !== null)
            ])
          }
        }
      }

      const onMouseMove = (event: TBrushEventData) => {
        if (!tempLine || points.length === 0) return
        const pointer = canvas?.getScenePoint(event.e)
        if (pointer) {
          const { x, y } = pointer

          tempLine.set({ x2: x, y2: y })
          canvas?.renderAll()
        }
      }

      const onFirstDotClick = (event: TBrushEventData) => {
        const pointer = canvas?.getScenePoint(event.e)
        if (pointer && points.length > 0) {
          const { x, y } = pointer

          const firstPoint = points[0]
          const distance = Math.sqrt(
            (x - firstPoint.x) ** 2 + (y - firstPoint.y) ** 2
          )

          if (distance < 8) {
            if (!imageBounds) {
              console.error('imageBounds is not defined')
              return
            }
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Disabling TS check for event typing
      const onPathCreated = (event: any) => {
        const brushStroke = event.path

        const strokeData: BrushStroke = {
          id: uuidv4(),
          labelId: chosenLabel.id,
          points: brushStroke.path.map((point: XY) => ({
            x: point.x,
            y: point.y
          })),
          object: brushStroke,
          timestamp: Date.now(),
          path: brushStroke.path
        }

        setBrushStrokes((prev: BrushStroke[]) => [...prev, strokeData])
      }

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
        gap: 3,
        minWidth: 240,
        maxHeight: { xs: 400, sm: 'none' }
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
        {!imageURL && (
          <Typography
            sx={{
              fontSize: {
                xs: '0.8rem',
                sm: '1.1rem'
              },
              color: '#c3c3c3',
              justifySelf: 'center',
              fontWeight: 600
            }}
          >
            Please upload an image to get started
          </Typography>
        )}
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
          disabled={actionHistory?.length === 0}
        />
        <Export onClick={handleExport} />
      </Box>

      {showSuccessAlert && <SuccessAlert />}
      {showFailExportAlert && <ErrorExportAlert />}
    </Paper>
  )
}

export default CanvasApp
