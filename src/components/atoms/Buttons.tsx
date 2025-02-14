import type { SvgIconComponent } from '@mui/icons-material'
import { IconButton, styled, Tooltip } from '@mui/material'
import { UndoRounded } from '@mui/icons-material'
import useTools from '../../store/useTools'

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
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

const NavbarButton = ({
  icon: Icon,
  title,
  ariaLabel,
  onClick,
  disabled
}: StyledNavButton) => {
  const tool = useTools((state) => state.tool)

  return (
    <Tooltip title={title} arrow>
      <StyledIconNavButton
        disableRipple
        aria-label={ariaLabel}
        size="medium"
        onClick={onClick}
        className={tool === ariaLabel ? 'chosen' : ''}
        disabled={disabled}
      >
        <Icon fontSize="inherit" />
      </StyledIconNavButton>
    </Tooltip>
  )
}

export default NavbarButton
