import { SaveRounded } from '@mui/icons-material'
import { Box, Button } from '@mui/material'

const Export = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'end',
      }}
    >
      <Button variant="outlined" startIcon={<SaveRounded />}>
        Export
      </Button>
    </Box>
  )
}

export default Export
