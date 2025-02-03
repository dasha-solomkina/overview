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
import useStore, { type LabelProps } from '../store/useStore'

const EditButton = styled(IconButton)(({ theme }) => ({
  opacity: 0,
  transition: 'opacity 0.2s',
  color: theme.palette.secondary.main
}))

const LabelManager = () => {
  const labels = useStore((state) => state.labels)
  const setLabels = useStore((state) => state.setLabels)
  const editLabel = useStore((state) => state.editLabel)
  const setEditLabel = useStore((state) => state.setEditLabel)
  const chosenLabel = useStore((state) => state.chosenLabel)
  const setChosenLabel = useStore((state) => state.setChosenLabel)

  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
  const [currentColor, setCurrentColor] = useState('#FF0000')

  // fix later
  const [anchorElEdit, setAnchorElEdit] = useState<null | HTMLElement>(null)
  const [openPopoverEdit, setOpenPopoverEdit] = useState<boolean>(false)
  const [editedTitle, setEditedTitle] = useState<string>('Initial Title')

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    LabelItem: LabelProps
  ) => {
    setEditLabel(LabelItem)
    setAnchorElEdit(event.currentTarget)
    setEditedTitle(LabelItem.name)
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
    const newTitle = event.target.value
    setEditedTitle(newTitle)
    if (editLabel) {
      setLabels(
        labels.map((cls) =>
          cls.id === editLabel.id ? { ...cls, name: newTitle } : cls
        )
      )
    }
  }

  const handleColorClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    LabelItem: LabelProps
  ) => {
    setAnchorEl(event.currentTarget)
    setEditLabel(LabelItem)
    setCurrentColor(LabelItem.color)
  }

  const handleColorChange = (color: string) => {
    setCurrentColor(color)
    setLabels(
      labels.map((cls) => (cls.id === editLabel?.id ? { ...cls, color } : cls))
    )
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNewLabelClick = () => {
    const newLabel = {
      id: uuidv4(),
      name: 'New Label (to edit)',
      color: 'red'
    }
    setLabels([...labels, newLabel])
  }

  //  TODO: add the check for the color

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
          Labels
        </Typography>
        <NavbarButton
          icon={AddCircleOutlineRounded}
          title="Add Label"
          ariaLabel="addLabel"
          onClick={handleNewLabelClick}
        />
      </Box>
      <Divider sx={{ mr: 2 }} />

      <List>
        {labels.map((LabelItem) => (
          <ListItem
            key={LabelItem.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover .edit-icon': { opacity: 1 },
              borderRadius: 2,
              cursor: 'pointer',
              backgroundColor:
                chosenLabel?.id === LabelItem.id
                  ? 'rgba(105, 0, 204, 0.1)'
                  : 'transparent'
            }}
            onClick={() => setChosenLabel(LabelItem)}
          >
            <ListItemText
              primary={LabelItem.name}
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis' // TODO: fix later
              }}
            />
            <IconButton
              disableRipple
              onClick={(e) => handleColorClick(e, LabelItem)}
              sx={{
                backgroundColor: `${LabelItem.color}`,
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
              onClick={(e) => handlePopoverOpen(e, LabelItem)}
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

export default LabelManager
