import { Box, Button, styled } from '@mui/material'
import {
  PolylineRounded,
  BrushRounded,
  CleaningServicesRounded
  // UndoRounded
} from '@mui/icons-material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import NavbarButton from './Buttons'
import useStore from '../store/useStore'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

// const Navbar = () => {
const Navbar = () => {
  const setImageURL = useStore((state) => state.setImageURL)
  const setTool = useStore((state) => state.setTool)
  const resetStore = useStore((state) => state.resetStore)

  const onNewImgClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetStore()
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (e) => {
      if (e.target?.result) {
        setImageURL(e.target.result as string)
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        bgcolor: 'background.paper',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: 2,
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.12)',
        py: 1,
        px: 2
      }}
    >
      <NavbarButton
        icon={PolylineRounded}
        title="Polygon"
        ariaLabel="polygon"
        onClick={() => setTool('polygon')}
      />
      <NavbarButton
        icon={BrushRounded}
        title="Brush"
        ariaLabel="brush"
        onClick={() => setTool('brush')}
      />
      <NavbarButton
        icon={CleaningServicesRounded}
        title="Erase"
        ariaLabel="erase"
        onClick={() => setTool('erase')}
      />

      <Button
        component="label"
        sx={{ marginLeft: 'auto' }}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={onNewImgClick}
          multiple
        />
      </Button>
    </Box>
  )
}

export default Navbar
