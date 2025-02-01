// import './App.css'
import { Box, Container } from '@mui/material'
import Navbar from './components/Navbar'
import ClassManager from './components/ClassManager'
import Canvas from './components/Canvas'
import Export from './components/Export'

const MyContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box bgcolor="background.default">
      <Container
        sx={{
          // height: '100vh',
          border: '1px solid black',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          padding={2}
          height="100vh"
        >
          {children}
        </Box>
      </Container>
    </Box>
  )
}

function App() {
  return (
    <MyContainer>
      <Navbar />
      <Box display="flex" width="100%" height="70%" gap={1}>
        <ClassManager />
        <Canvas />
      </Box>
      <Export />
    </MyContainer>
  )
}

export default App
