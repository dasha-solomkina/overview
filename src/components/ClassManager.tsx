import { Edit } from '@mui/icons-material'
import {
  Box,
  // Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  styled
  // Typography,
} from '@mui/material'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

// type ClassProps = {
//   id: string
//   name: string
//   color: string
//   superCategory?: string
// }

const initialClasses = [
  { id: 1, name: 'First Class', color: '#FF5733' },
  { id: 2, name: 'Second Class', color: '#33FF57' },
  { id: 3, name: 'Third Class', color: '#3357FF' }
]

const EditButton = styled(IconButton)(({ theme }) => ({
  opacity: 0,
  transition: 'opacity 0.2s',
  color: theme.palette.secondary.main
}))

const ClassManager = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
  const [selectedColor, setSelectedColor] = useState('#FFFFFF')
  // const [classes, setClasses] = useState<ClassProps[]>([])
  const [classes, setClasses] = useState(initialClasses)
  const [colorChosen, setColorChosen] = useState<[string | null]>([null])

  const handleColorClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    color: string
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedColor(color)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  //  add the check for the color

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '20%'
      }}
    >
      <List>
        {classes.map((classItem) => (
          <ListItem
            key={classItem.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover .edit-icon': { opacity: 1 }
            }}
          >
            <ListItemText primary={classItem.name} />
            <IconButton
              disableRipple
              onClick={(e) => handleColorClick(e, classItem.color)}
              sx={{
                backgroundColor: `${classItem.color}`,
                width: 12,
                height: 12,
                borderRadius: '50%',
                marginRight: 1,
                padding: 0
              }}
            />
            <EditButton className="edit-icon" disableRipple size="small">
              <Edit fontSize="inherit" />
            </EditButton>
          </ListItem>
        ))}

        {/* First Class */}
      </List>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <HexColorPicker color={selectedColor} />
      </Popover>
    </Box>
  )
}

export default ClassManager
