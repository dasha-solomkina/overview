import type { SvgIconComponent } from '@mui/icons-material'
import { IconButton, styled, Tooltip } from '@mui/material'
import useStore from '../store/useStore'

const StyledIconButton = styled(IconButton)(({ theme }) => ({
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

type NavbarButton = {
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
}: NavbarButton) => {
  const tool = useStore((state) => state.tool)

  return (
    <Tooltip title={title} arrow>
      <StyledIconButton
        disableRipple
        aria-label={ariaLabel}
        size="medium"
        onClick={onClick}
        className={tool === ariaLabel ? 'chosen' : ''}
      >
        <Icon fontSize="inherit" />
      </StyledIconButton>
    </Tooltip>
  )
}

export default NavbarButton
