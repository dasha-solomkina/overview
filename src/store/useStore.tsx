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
  image: string | undefined
  tool: 'polygon' | 'brush' | 'erase' | undefined
  editLabel: LabelProps | undefined
  labels: LabelProps[]
  chosenLabel: LabelProps | undefined
  polygons: Polygon[]
  brushStrokes: BrushStroke[]

  setImage: (image: string) => void
  setTool: (tool: 'polygon' | 'brush' | 'erase' | undefined) => void
  setEditLabel: (label: LabelProps) => void
  setLabels: (labels: LabelProps[]) => void
  setChosenLabel: (labels: LabelProps | undefined) => void
  setPolygons: (polygon: Polygon) => void
  addBrushStroke: (stroke: BrushStroke) => void

  resetStore: () => void
}

// TODO: Brush stroke

const useStore = create<StorePops>((set) => ({
  image: undefined,
  tool: undefined,
  editLabel: undefined,
  labels: [
    { id: uuidv4(), name: 'Label 1', color: '#FF0000' },
    { id: uuidv4(), name: 'Label 2', color: '#00FF00' }
  ],
  chosenLabel: undefined,
  polygons: [],
  brushStrokes: [],

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
  addBrushStroke: (stroke) =>
    set((state) => ({ brushStrokes: [...state.brushStrokes, stroke] })),

  resetStore: () => {
    set({
      image: undefined,
      tool: undefined,
      editLabel: undefined,
      // labels: [],
      chosenLabel: undefined,
      polygons: [],
      brushStrokes: []
    })
  }
}))

export default useStore
