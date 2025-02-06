import type { FabricObject } from 'fabric'

export type Image = {
  height: number
  width: number
  name?: string
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

export type XY = {
  x: number
  y: number
}
