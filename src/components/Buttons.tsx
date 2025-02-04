import type { SvgIconComponent } from '@mui/icons-material'
import { IconButton, styled, Tooltip } from '@mui/material'
import useStore from '../store/useStore'
import { UndoRounded } from '@mui/icons-material'

const StyledBackButton = styled(IconButton)(() => ({
  width: 'fit-content',
  opacity: 0.7,
  color: '#6a00cb',

  '&:hover': {
    opacity: 0.9
  },
  '&.disabled': {
    color: '#c3c3c3',
    cursor: 'unset'
  }
}))

type StyledBackButton = {
  title: string
  ariaLabel: string
  onClick: VoidFunction
  disabled?: boolean
}

export const BackButton = ({
  title,
  ariaLabel,
  onClick,
  disabled
}: StyledBackButton) => {
  return (
    <Tooltip title={title} arrow>
      <StyledBackButton
        disableRipple
        aria-label={ariaLabel}
        size="medium"
        onClick={onClick}
        className={disabled ? 'disabled' : ''}
      >
        <UndoRounded fontSize="inherit" />
      </StyledBackButton>
    </Tooltip>
  )
}

const StyledIconNavButton = styled(IconButton)(({ theme }) => ({
  // borderRadius: 2, // Make it square
  width: 44,
  height: 44,

  padding: 2,
  color: '#6a00cb',
  '&:hover': {
    backgroundColor: 'rgba(105, 0, 204, 0.1)'
  },
  '&.chosen': {
    border: `1px solid ${theme.palette.primary.main}`
  }
}))

type StyledNavButton = {
  icon: SvgIconComponent
  title: string
  ariaLabel: string
  onClick: VoidFunction
}

const NavbarButton = ({
  icon: Icon,
  title,
  ariaLabel,
  onClick
}: StyledNavButton) => {
  const tool = useStore((state) => state.tool)

  return (
    <Tooltip title={title} arrow>
      <StyledIconNavButton
        disableRipple
        aria-label={ariaLabel}
        size="medium"
        onClick={onClick}
        className={tool === ariaLabel ? 'chosen' : ''}
      >
        <Icon fontSize="inherit" />
      </StyledIconNavButton>
    </Tooltip>
  )
}

export default NavbarButton
