// import './App.css'
import { Box, Container } from '@mui/material'
import Navbar from './components/Navbar'
import ClassManager from './components/ClassManager'
import Canvas from './components/Canvas'
import { useUndo } from './hooks/useUndo'

const MyContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box bgcolor="background.default">
      <Container
        sx={
          {
            // height: '100vh',
            // border: '1px solid black' // TODO: remove
          }
        }
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
  const {
    canvas,
    setCanvas,
    actionHistory,
    setActionHistory,
    handleUndoClick
  } = useUndo()

  return (
    <MyContainer>
      {/* <Navbar /> */}
      <Navbar
        onUndoClick={handleUndoClick}
        canUndo={actionHistory.length > 0}
      />
      <Box display="flex" width="100%" height="80%" gap={1}>
        <ClassManager />
        {/* <Canvas /> */}
        <Canvas
          setCanvas={setCanvas}
          actionHistory={actionHistory}
          setActionHistory={setActionHistory}
        />
      </Box>
    </MyContainer>
  )
}

export default App
