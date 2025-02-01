import { Box, Button, Typography } from '@mui/material'

const ClassManager = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '20%'
      }}
    >
      <Typography variant="h4">Classes</Typography>
      <Typography variant="body1">Class 1</Typography>
      <Typography variant="body1">Class 2</Typography>

      <Button sx={{ marginTop: 'auto' }}>Add class</Button>
    </Box>
  )
}

export default ClassManager
