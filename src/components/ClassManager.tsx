import { AddCircleOutlineRounded, Edit } from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  styled,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import NavbarButton from './NavbarButton'

type ClassProps = {
  id: string
  name: string
  color: string
  superCategory?: string
}

const initialClasses = [
  { id: uuidv4(), name: 'First Class', color: '#FF5733' },
  { id: uuidv4(), name: 'Second Class', color: '#33FF57' },
  { id: uuidv4(), name: 'Third Class', color: '#3357FF' }
]

const EditButton = styled(IconButton)(({ theme }) => ({
  opacity: 0,
  transition: 'opacity 0.2s',
  color: theme.palette.secondary.main
}))

const ClassManager = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
  const [currentColor, setCurrentColor] = useState('#FFFFFF')
  const [selectedClass, setSelectedClass] = useState<null | ClassProps>(null) // will have to rename
  // const [classes, setClasses] = useState<ClassProps[]>([])
  const [classes, setClasses] = useState(initialClasses)
  // const [colorChosen, setColorChosen] = useState<[string | null]>([null])

  // fix later
  const [anchorElEdit, setAnchorElEdit] = useState<null | HTMLElement>(null)
  const [openPopoverEdit, setOpenPopoverEdit] = useState<boolean>(false)
  const [editedTitle, setEditedTitle] = useState<string>('Initial Title')

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    classItem: ClassProps
  ) => {
    setSelectedClass(classItem) // Set selected class
    setAnchorElEdit(event.currentTarget)
    setEditedTitle(classItem.name) // Set the edited title from the selected class name
    setOpenPopoverEdit(true)
  }

  const handlePopoverClose = () => {
    setOpenPopoverEdit(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      setOpenPopoverEdit(false)
    }
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setEditedTitle(event.target.value)
    const newTitle = event.target.value
    setEditedTitle(newTitle)
    if (selectedClass) {
      setClasses(
        classes.map((cls) =>
          cls.id === selectedClass.id ? { ...cls, name: newTitle } : cls
        )
      )
    }
  }

  //

  const handleColorClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    classItem: ClassProps
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedClass(classItem)
    setCurrentColor(classItem.color)
  }

  const handleColorChange = (color: string) => {
    setCurrentColor(color)
    setClasses(
      classes.map((cls) =>
        cls.id === selectedClass?.id ? { ...cls, color } : cls
      )
    )
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNewClassClick = () => {
    const newClass = {
      id: uuidv4(),
      name: 'New Class (to edit)',
      color: 'red'
    }
    setClasses((prevClasses) => [...prevClasses, newClass])
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
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography fontSize="1.1rem" fontWeight={600}>
          Classes
        </Typography>
        <NavbarButton
          icon={AddCircleOutlineRounded}
          title="Add class"
          ariaLabel="addClass"
          onClick={handleNewClassClick}
        />
      </Box>
      <Divider sx={{ mr: 2 }} />

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
            <ListItemText
              primary={classItem.name}
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis' // fix later
              }}
            />
            <IconButton
              disableRipple
              onClick={(e) => handleColorClick(e, classItem)}
              sx={{
                backgroundColor: `${classItem.color}`,
                width: 12,
                height: 12,
                borderRadius: '50%',
                marginRight: 1,
                padding: 0
              }}
            />
            <EditButton
              className="edit-icon"
              disableRipple
              size="small"
              onClick={(e) => handlePopoverOpen(e, classItem)}
            >
              <Edit fontSize="inherit" />
            </EditButton>
          </ListItem>
        ))}
      </List>

      <Popover
        open={openPopoverEdit}
        anchorEl={anchorElEdit}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <TextField
          value={editedTitle}
          onChange={handleTitleChange}
          sx={{
            padding: '10px'
          }}
          onKeyDown={handleKeyDown}
          onBlur={handlePopoverClose}
        />
      </Popover>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          '.MuiPopover-paper': {
            overflow: 'hidden',
            borderRadius: 2
          }
        }}
      >
        <HexColorPicker color={currentColor} onChange={handleColorChange} />
      </Popover>
    </Box>
  )
}

export default ClassManager
