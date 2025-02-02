import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export type LabelProps = {
  id: string
  name: string
  color: string
}

type Polygon = {
  labelId: number
  points: { x: number; y: number }[]
}

type BrushStroke = {
  labelId: number
  points: { x: number; y: number }[]
}

type StorePops = {
  image: string | null
  tool: 'polygon' | 'brush' | 'eraser' | null
  editLabel: LabelProps | null
  labels: LabelProps[]
  polygons: Polygon[]
  brushStrokes: BrushStroke[]

  setImage: (image: string) => void
  setTool: (tool: 'polygon' | 'brush' | 'eraser' | null) => void
  setEditLabel: (label: LabelProps) => void
  setLabels: (label: LabelProps[]) => void
  addPolygon: (polygon: Polygon) => void
  addBrushStroke: (stroke: BrushStroke) => void
}

const useStore = create<StorePops>((set) => ({
  image: null,
  tool: null,
  editLabel: null,
  labels: [
    { id: uuidv4(), name: 'Label 1', color: '#FF0000' },
    { id: uuidv4(), name: 'Label 2', color: '#00FF00' }
  ],
  polygons: [],
  brushStrokes: [],

  setImage: (image) => set({ image }),
  setTool: (tool) => set({ tool }),
  setEditLabel: (label) => set({ editLabel: label }),
  setLabels: (labels) => set(() => ({ labels })),
  addPolygon: (polygon) =>
    set((state) => ({ polygons: [...state.polygons, polygon] })),
  addBrushStroke: (stroke) =>
    set((state) => ({ brushStrokes: [...state.brushStrokes, stroke] }))
}))

export default useStore
