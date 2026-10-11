import React from 'react'
import { makeStyles } from '@mui/styles'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const useStyles = makeStyles(() => ({
  progress: {
    display: 'block',
    margin: '0 auto',
  },
  message: {
    marginTop: '1rem',
    textAlign: 'center',
    fontWeight: 100,
    fontSize: '125%',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '7.5rem',
    height: '7.5rem',
    fontSize: '5rem',
    textAlign: 'center',
  },
  fill: {
    width: 'auto',
    height: '100%',
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}))

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Icon = styled(HourglassBottomIcon)`
  animation: ${spin} 1s linear infinite;
`

const LoadingIndicator = ({
  message = '',
  fill = false,
  className = '',
}: {
  message?: React.ReactNode
  fill?: boolean
  className?: string
}) => {
  const classes = useStyles()
  return (
    <div className={className}>
      <div className={classes.iconWrapper}>
        <div className={`${classes.icon} ${fill ? classes.fill : ''}`}>
          <Icon />
        </div>
      </div>
      {message && <div className={classes.message}>{message}</div>}
    </div>
  )
}

export default LoadingIndicator
