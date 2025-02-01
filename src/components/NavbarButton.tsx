import type { SvgIconComponent } from '@mui/icons-material'
import { IconButton, styled, Tooltip } from '@mui/material'

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  // borderRadius: 2, // Make it square
  // backgroundColor: 'red',
  width: 44,
  height: 44,

  padding: 2,
  color: '#6a00cb',
  '&:hover': {
    // backgroundColor: 'rgba(105, 0, 204, 0.1)', // mb mb
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`, // remove later?
  },
}))

type NavbarButton = {
  icon: SvgIconComponent
  title: string
  ariaLabel: string
}

const NavbarButton = ({ icon: Icon, title, ariaLabel }: NavbarButton) => {
  return (
    <Tooltip title={title} arrow>
      <StyledIconButton aria-label={ariaLabel} size="medium">
        <Icon fontSize="inherit" />
      </StyledIconButton>
    </Tooltip>
  )
}

export default NavbarButton
