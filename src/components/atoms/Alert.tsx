import { Alert as SimpleAlert } from '@mui/material/'
import CheckIcon from '@mui/icons-material/Check'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export default function SuccessAlert() {
  return (
    <SimpleAlert
      sx={{
        width: 'fit-content',
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        py: 0,
        bgcolor: 'rgb(150, 200, 170)'
      }}
      icon={<CheckIcon fontSize="inherit" />}
      severity="success"
    >
      Exported successfully.
    </SimpleAlert>
  )
}

export function ErrorExportAlert() {
  return (
    <SimpleAlert
      sx={{
        width: 'fit-content',
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        py: 0,
        bgcolor: 'rgb(255, 120, 120)'
      }}
      icon={<ErrorOutlineIcon fontSize="inherit" />}
      severity="error"
    >
      Something went wrong. Please contact support for assistance.
    </SimpleAlert>
  )
}

export function ErrorColorAlert() {
  return (
    <SimpleAlert
      sx={{
        width: 'fit-content',
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        py: 0,
        bgcolor: 'rgb(255, 120, 120)'
      }}
      icon={<ErrorOutlineIcon fontSize="inherit" />}
      severity="error"
    >
      Color labels must be unique. Please update the label colors.
    </SimpleAlert>
  )
}
