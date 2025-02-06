import { create } from 'zustand'
import type { Polygon, BrushStroke } from '../types/type'

type StorePops = {
  tool: 'polygon' | 'brush' | 'erase' | undefined
  polygons: Polygon[]
  brushStrokes: BrushStroke[]
  brushSize: number

  setTool: (tool: 'polygon' | 'brush' | 'erase' | undefined) => void
  setPolygons: (polygon: Polygon) => void
  setBrushStrokes: (
    strokes: BrushStroke[] | ((prev: BrushStroke[]) => BrushStroke[])
  ) => void

  setBrushSize: (brush: number) => void
  resetTools: () => void
}

const useTools = create<StorePops>((set) => ({
  tool: undefined,
  polygons: [],
  brushStrokes: [],
  brushSize: 18,

  setTool: (tool) =>
    set((state) => ({
      tool: state.tool === tool ? undefined : tool
    })),
  setPolygons: (polygon) =>
    set((state) => ({ polygons: [...state.polygons, polygon] })),
  setBrushStrokes: (strokes) => {
    set((state) => ({
      brushStrokes:
        typeof strokes === 'function' ? strokes(state.brushStrokes) : strokes
    }))
  },

  setBrushSize: (brushSize) => set({ brushSize }),

  resetTools: () => {
    set({
      tool: undefined,
      polygons: [],
      brushStrokes: [],
      brushSize: 8
    })
  }
}))

export default useTools
