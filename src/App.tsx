// import './App.css'
import { Box, Container } from '@mui/material'
import Navbar from './components/Navbar'
import ClassManager from './components/ClassManager'
import Canvas from './components/Canvas'

const MyContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box bgcolor="background.default">
      <Container maxWidth="lg">
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
      <Box
        display="flex"
        width="100%"
        height="80%"
        gap={1}
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <ClassManager />
        <Canvas />
      </Box>
    </MyContainer>
  )
}

export default App
