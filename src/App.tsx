// import './App.css'
import { Box, Container } from '@mui/material'
import Navbar from './components/Navbar'
import ClassManager from './components/ClassManager'
import Canvas from './components/Canvas'
import Export from './components/Export'

function App() {

  return (
    <Container 
    sx={{ 
      // bgcolor: 'white', 
      height: '100vh'
    }}
  >
    <Navbar/>
    <Box display="flex" width='100%'>
      <ClassManager/>
      <Canvas/>
    </Box>
    <Export/>

  </Container>
  )
}

export default App
