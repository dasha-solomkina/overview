import { SaveRounded } from '@mui/icons-material'
import { Box, Button } from '@mui/material'

const Export = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'end'
      }}
    >
      <Button onClick={onClick} variant="outlined" startIcon={<SaveRounded />}>
        Export
      </Button>
    </Box>
  )
}

export default Export
