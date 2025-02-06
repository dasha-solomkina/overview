import { create } from 'zustand'
import type { FabricObject } from 'fabric'

export type Image = {
  height: number
  width: number
}

export type LabelProps = {
  id: number
  name: string
  color: string
}

export type Polygon = {
  labelId: number
  color?: string
  points: { x: number; y: number }[]
}

export type Path = [string, number, number, number?, number?][]

export type BrushStroke = {
  id: string
  labelId: number
  points: { x: number; y: number }[]
  object: FabricObject
  timestamp: number
  path: Path
}

type StorePops = {
  imageURL: string | undefined
  image: Image | undefined
  tool: 'polygon' | 'brush' | 'erase' | undefined
  editLabel: LabelProps | undefined
  labels: LabelProps[]
  chosenLabel: LabelProps | undefined
  polygons: Polygon[]
  brushStrokes: BrushStroke[]
  brushSize: number

  setImageURL: (imageURL: string) => void
  setImage: (image: Image) => void
  setTool: (tool: 'polygon' | 'brush' | 'erase' | undefined) => void
  setEditLabel: (label: LabelProps) => void
  setLabels: (labels: LabelProps[]) => void
  setChosenLabel: (labels: LabelProps | undefined) => void
  setPolygons: (polygon: Polygon) => void
  setBrushStrokes: (
    strokes: BrushStroke[] | ((prev: BrushStroke[]) => BrushStroke[])
  ) => void
  undoBrushStroke: (id: string) => void

  setBrushSize: (brush: number) => void
  resetStore: () => void
}

const useStore = create<StorePops>((set) => ({
  imageURL: undefined,
  image: undefined,
  tool: undefined,
  editLabel: undefined,
  labels: [
    { id: 10293847, name: 'Label 1', color: '#FF0000' },
    { id: 10293832, name: 'Label 2', color: '#00FF00' }
  ],
  chosenLabel: undefined,
  polygons: [],
  brushStrokes: [],
  brushSize: 18,

  setImageURL: (imageURL) => set({ imageURL }),
  setImage: (image) => set({ image }),
  setTool: (tool) =>
    set((state) => ({
      tool: state.tool === tool ? undefined : tool
    })),
  setEditLabel: (label) => set({ editLabel: label }),
  setLabels: (labels) => set(() => ({ labels })),
  setChosenLabel: (chosenLabel) =>
    set((state) => ({
      chosenLabel: state.chosenLabel === chosenLabel ? undefined : chosenLabel
    })),

  setPolygons: (polygon) =>
    set((state) => ({ polygons: [...state.polygons, polygon] })),
  setBrushStrokes: (strokes) => {
    set((state) => ({
      brushStrokes:
        typeof strokes === 'function' ? strokes(state.brushStrokes) : strokes
    }))
  },

  undoBrushStroke: (id: string) =>
    set((state) => ({
      brushStrokes: state.brushStrokes.filter((stroke) => stroke.id !== id)
    })),
  setBrushSize: (brushSize) => set({ brushSize }),

  resetStore: () => {
    set({
      imageURL: undefined,
      tool: undefined,
      editLabel: undefined,
      chosenLabel: undefined,
      polygons: [],
      brushStrokes: [],
      brushSize: 8
    })
  }
}))

export default useStore
