import { Box, Button } from "@mui/material"

const Navbar = () => {

    return (
      <Box 
      sx={{ 
        bgcolor: 'pink',
        display: 'flex',
        gap: 1,
      }}
    >
      <Button>polygon</Button>
      <Button>brush</Button>
      <Button>erase</Button>
      <Button>back</Button>
      <Button sx={{marginLeft: 'auto'}}>upload file</Button>
    </Box>
    )
  }
  
  export default Navbar