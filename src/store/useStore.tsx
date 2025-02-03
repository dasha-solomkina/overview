import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export type LabelProps = {
  id: string
  name: string
  color: string
}

type Polygon = {
  labelId: string
  points: { x: number; y: number }[]
}

type BrushStroke = {
  labelId: number
  points: { x: number; y: number }[]
}

type StorePops = {
  image: string | null
  tool: 'polygon' | 'brush' | 'erase' | 'back' | null
  editLabel: LabelProps | null
  labels: LabelProps[]
  chosenLabel: LabelProps | null
  polygons: Polygon[]
  brushStrokes: BrushStroke[]

  setImage: (image: string) => void
  setTool: (tool: 'polygon' | 'brush' | 'erase' | 'back' | null) => void
  setEditLabel: (label: LabelProps) => void
  setLabels: (labels: LabelProps[]) => void
  setChosenLabel: (labels: LabelProps | null) => void
  setPolygons: (polygon: Polygon) => void
  addBrushStroke: (stroke: BrushStroke) => void
}

// todo Brush stroke

const useStore = create<StorePops>((set) => ({
  image: null,
  tool: null,
  editLabel: null,
  labels: [
    { id: uuidv4(), name: 'Label 1', color: '#FF0000' },
    { id: uuidv4(), name: 'Label 2', color: '#00FF00' }
  ],
  chosenLabel: null,
  polygons: [],
  brushStrokes: [],

  setImage: (image) => set({ image }),
  setTool: (tool) =>
    set((state) => ({
      tool: state.tool === tool ? null : tool
    })),
  setEditLabel: (label) => set({ editLabel: label }),
  setLabels: (labels) => set(() => ({ labels })),
  setChosenLabel: (chosenLabel) =>
    set((state) => ({
      chosenLabel: state.chosenLabel === chosenLabel ? null : chosenLabel
    })),

  setPolygons: (polygon) =>
    set((state) => ({ polygons: [...state.polygons, polygon] })),
  addBrushStroke: (stroke) =>
    set((state) => ({ brushStrokes: [...state.brushStrokes, stroke] }))
}))

export default useStore
