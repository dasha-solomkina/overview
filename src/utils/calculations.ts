export const getBoundingBox = (points: { x: number; y: number }[]) => {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)

  const xmin = Math.min(...xs)
  const xmax = Math.max(...xs)
  const ymin = Math.min(...ys)
  const ymax = Math.max(...ys)

  return [xmin, ymin, xmax - xmin, ymax - ymin]
}

export const calculateBoundingBox = (
  points: { x: number; y: number }[]
): number[] => {
  const minX = Math.min(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.y))
  const maxX = Math.max(...points.map((p) => p.x))
  const maxY = Math.max(...points.map((p) => p.y))

  return [minX, minY, maxX - minX, maxY - minY] // Format: [x, y, width, height]
}

export const calculatePolygonArea = (points: { x: number; y: number }[]) => {
  let area = 0
  const n = points.length

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += points[i].x * points[j].y
    area -= points[i].y * points[j].x
  }

  area = Math.abs(area) / 2
  return area
}

export const generateRandomId = (length: number): number => {
  return Math.floor(Math.random() * 10 ** length)
}
