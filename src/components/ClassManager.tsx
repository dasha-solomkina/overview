import { AddCircleOutlineRounded, Edit, Delete } from '@mui/icons-material'
import {
  Box,
  Button,
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
import NavbarButton from './Buttons'
import useStore, { type LabelProps } from '../store/useStore'
import { generateRandomId } from '../utils/calculations'
import { ErrorColorAlert } from './Alert'

const EditDeleteButton = styled(IconButton)(({ theme }) => ({
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

  const [text, setText] = useState('')
  const [color, setColor] = useState('#000000')

  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)

  const [anchorElEdit, setAnchorElEdit] = useState<null | HTMLElement>(null)
  const [openPopoverEdit, setOpenPopoverEdit] = useState<boolean>(false)
  const [editedTitle, setEditedTitle] = useState<string>('Initial Title')
  const [showColorAlert, setShowColorAlert] = useState(false)

  const onAddClassClick = () => {
    const isColorInUse = labels.some((label) => label.color === color)

    if (!isColorInUse) {
      const newLabel = {
        id: generateRandomId(8),
        name: text,
        color: color
      }

      setLabels([...labels, newLabel])
      setAnchorEl(null)
      setText('')
    } else {
      setShowColorAlert(true)
      setTimeout(() => {
        setShowColorAlert(false)
      }, 3000)
    }
  }

  const onDeleteLabel = (LabelItem: LabelProps) => {
    const updatedLabels = labels.filter((label) => label.id !== LabelItem.id)
    setLabels(updatedLabels)
  }

  const onPopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    LabelItem: LabelProps
  ) => {
    setEditLabel(LabelItem)
    setAnchorElEdit(event.currentTarget)
    setEditedTitle(LabelItem.name)
    setOpenPopoverEdit(true)
  }

  const onPopoverClose = () => {
    setOpenPopoverEdit(false)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      setOpenPopoverEdit(false)
    }
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value
    setEditedTitle(newTitle)
    if (editLabel) {
      setLabels(
        labels.map((label) =>
          label.id === editLabel.id ? { ...label, name: newTitle } : label
        )
      )
    }
  }

  const onColorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const onClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: { xs: '100%', sm: '20%' },
        flexShrink: 0,
        minWidth: 240
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
          onClick={(e) => onColorClick(e)}
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
              '&:hover .editdelete-icon': { opacity: 1 },
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
                '& .MuiTypography-root': {
                  fontWeight: 600
                },
                color: LabelItem.color,
                marginRight: 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            />

            <EditDeleteButton
              className="editdelete-icon"
              disableRipple
              size="small"
              onClick={(e) => onPopoverOpen(e, LabelItem)}
            >
              <Edit fontSize="inherit" />
            </EditDeleteButton>

            <EditDeleteButton
              className="editdelete-icon"
              disableRipple
              size="small"
              onClick={() => onDeleteLabel(LabelItem)}
            >
              <Delete fontSize="inherit" />
            </EditDeleteButton>
          </ListItem>
        ))}
      </List>

      <Popover
        open={openPopoverEdit}
        anchorEl={anchorElEdit}
        onClose={onPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <TextField
          value={editedTitle}
          onChange={onTitleChange}
          onKeyDown={onKeyDown}
          onBlur={onPopoverClose}
        />
      </Popover>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          '.MuiPopover-paper': {
            overflow: 'hidden',
            borderRadius: 2
          }
        }}
      >
        <Box
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            label="Enter label name"
            variant="outlined"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="small"
          />

          <TextField
            label="Choose color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            variant="outlined"
            sx={{
              padding: 0,
              '& .MuiInputBase-input': {
                cursor: 'pointer',
                padding: 1
              }
            }}
          />
          <Button onClick={onAddClassClick} variant="contained">
            Add label
          </Button>
        </Box>
      </Popover>
      {showColorAlert && <ErrorColorAlert />}
    </Box>
  )
}

export default LabelManager
