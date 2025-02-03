import { useState } from 'react'

export function useUndo() {
  const [actionHistory, setActionHistory] = useState<any[][]>([])
  const [canvas, setCanvas] = useState<any>(null)

  const handleUndoClick = () => {
    if (actionHistory.length > 0) {
      const lastActions = actionHistory[actionHistory.length - 1]

      for (const action of lastActions) {
        canvas?.remove(action)
      }

      setActionHistory((prevHistory) => prevHistory.slice(0, -1))
    }
  }

  return { canvas, setCanvas, actionHistory, setActionHistory, handleUndoClick }
}
