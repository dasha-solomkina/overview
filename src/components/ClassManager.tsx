import { AddCircleOutlineRounded, Edit } from '@mui/icons-material'
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
import NavbarButton from './Buttons'
import useStore, { type LabelProps } from '../store/useStore'
import { generateRandomId } from '../utils/calculations'

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

  const onColorClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    LabelItem: LabelProps
  ) => {
    setAnchorEl(event.currentTarget)
    setEditLabel(LabelItem)
    setCurrentColor(LabelItem.color)
  }

  const onColorChange = (color: string) => {
    setCurrentColor(color)
    setLabels(
      labels.map((label) =>
        label.id === editLabel?.id ? { ...label, color } : label
      )
    )
  }

  const onClose = () => {
    setAnchorEl(null)
  }

  const onNewLabelClick = () => {
    const newLabel = {
      id: generateRandomId(8),
      name: 'New Label (to edit)',
      color: '#0000FF'
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
          onClick={onNewLabelClick}
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
              onClick={(e) => onColorClick(e, LabelItem)}
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
              onClick={(e) => onPopoverOpen(e, LabelItem)}
            >
              <Edit fontSize="inherit" />
            </EditButton>
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
          sx={{
            padding: '10px'
          }}
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
        <HexColorPicker color={currentColor} onChange={onColorChange} />
      </Popover>
    </Box>
  )
}

export default LabelManager
