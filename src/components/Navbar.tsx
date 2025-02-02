import { Box, Button, styled } from '@mui/material'
import {
  PolylineRounded,
  BrushRounded,
  CleaningServicesRounded,
  UndoRounded
} from '@mui/icons-material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import NavbarButton from './NavbarButton'

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

type setImageProps = {
  setImage: (image: string) => void
}

const Navbar = ({ setImage }: setImageProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string)
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
      />
      <NavbarButton icon={BrushRounded} title="Brush" ariaLabel="brush" />
      <NavbarButton
        icon={CleaningServicesRounded}
        title="Erase"
        ariaLabel="erase"
      />
      <NavbarButton icon={UndoRounded} title="Back" ariaLabel="back" />

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
          onChange={handleImageUpload}
          multiple
        />
      </Button>
    </Box>
  )
}

export default Navbar
