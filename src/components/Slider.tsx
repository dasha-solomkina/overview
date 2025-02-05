import { Slider as SimpleSlider, Box } from '@mui/material'
import useStore from '../store/useStore'

const Slider = () => {
  const brushSize = useStore((state) => state.brushSize)
  const setBrushSize = useStore((state) => state.setBrushSize)
  const calculateThumbSize = () => {
    const minSize = 10
    const maxSize = 16
    const size = (brushSize / 100) * (maxSize - minSize) + minSize
    return size
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setBrushSize(newValue as number)
  }

  return (
    <Box sx={{ width: 200, margin: '0 auto' }}>
      <SimpleSlider
        value={brushSize}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        defaultValue={8}
        aria-label="brush-width"
        min={1}
        max={50}
        sx={{
          '& .MuiSlider-thumb': {
            width: calculateThumbSize(),
            height: calculateThumbSize(),
            backgroundColor: '#cba8f4',
            '&:hover': {
              backgroundColor: '#a283d9'
            },
            '&.Mui-focusVisible': {
              backgroundColor: '#9e7cd9'
            },
            '&:active': {
              backgroundColor: '#8b6fbb'
            }
          }
        }}
      />
    </Box>
  )
}

export default Slider
