import {
  Box,
  Button,
  Popover,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  PolylineRounded,
  BrushRounded,
  CleaningServicesRounded
} from '@mui/icons-material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import NavbarButton from './atoms/Buttons'
import useStore from '../store/useStore'
import { useState } from 'react'
import Slider from './atoms/Slider'
import useTools from '../store/useTools'

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

const containerStyles = {
  display: 'flex',
  gap: 1,
  bgcolor: 'background.paper',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: 2,
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.12)',
  py: 1,
  px: 2,
  minWidth: 240,
  overflow: 'hidden',
  flexWrap: { xl: 'nowrap', sm: 'wrap' },
  alignItems: { xs: 'center', sm: 'center' }
}

const Navbar = () => {
  const setImageURL = useStore((state) => state.setImageURL)
  const setTool = useTools((state) => state.setTool)
  const resetStore = useStore((state) => state.resetStore)
  const resetTools = useTools((state) => state.resetTools)
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
  const onClose = () => {
    setAnchorEl(null)
  }

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const onNewImgClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetStore()
    resetTools()
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

  const onBrushClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setTool('brush')
  }

  return (
    <Box sx={containerStyles}>
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
        onClick={(event) => onBrushClick(event)}
      />
      <NavbarButton
        icon={CleaningServicesRounded}
        title="Erase"
        ariaLabel="erase"
        onClick={() => setTool('erase')}
        disabled
      />

      <Button
        component="label"
        sx={{ marginLeft: 'auto' }}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon sx={{ marginLeft: 1 }} />}
      >
        {!isSmallScreen && 'Upload image'}
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={onNewImgClick}
          multiple
        />
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          '.MuiPopover-paper': {
            overflow: 'hidden',
            borderRadius: 2
          }
        }}
      >
        <Box
          sx={{
            width: 300,
            px: 3,
            height: 60,
            display: 'flex',
            alignItems: 'end'
          }}
        >
          <Slider />
        </Box>
      </Popover>
    </Box>
  )
}

export default Navbar
