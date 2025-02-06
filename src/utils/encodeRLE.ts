import type { BrushStroke } from '../store/useStore'

// Converts a binary mask to RLE format
export const encodeRLE = (mask: number[]): number[] => {
  const rle: number[] = []
  let count = 0
  let current = mask[0]

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === current) {
      count++
    } else {
      rle.push(count)
      rle.push(current)
      count = 1
      current = mask[i]
    }
  }

  rle.push(count) // Add last count
  rle.push(current)
  return rle
}

// Converts a brush stroke path into a binary mask
export const rasterizeBrushStrokes = (
  brushStrokes: BrushStroke[],
  canvasWidth: number,
  canvasHeight: number
): number[] => {
  const mask = new Array(
    Math.floor(canvasWidth) * Math.floor(canvasHeight)
  ).fill(0)

  for (const stroke of brushStrokes) {
    for (const [cmd, ...coords] of stroke.path) {
      if (cmd === 'M' || cmd === 'L') {
        const [x, y] = coords
        const index = Math.floor(y) * canvasWidth + Math.floor(x)
        mask[index] = 1
      }
    }
  }
  return mask
}

export const rleToPolygon = (rle: number[], width: number) => {
  let x = 0
  let y = 0
  const polygon = []
  let currentPixel = 0
  let count = 0

  for (let i = 0; i < rle.length; i++) {
    count = rle[i]
    for (let j = 0; j < count; j++) {
      if (currentPixel % width === 0 && currentPixel !== 0) {
        y++
        x = 0
      }
      if (rle[i] === 1) {
        polygon.push(x, y)
      }
      x++
      currentPixel++
    }
  }
  return polygon
}

// Convert brush strokes into an RLE segmentation
export const convertBrushStrokesToRLE = (
  brushStrokes: BrushStroke[],
  canvasWidth: number,
  canvasHeight: number
): number[][] => {
  return brushStrokes.map((stroke) => {
    const binaryMask = rasterizeBrushStrokes(
      [stroke],
      canvasWidth,
      canvasHeight
    )
    return encodeRLE(binaryMask)
  })
}
