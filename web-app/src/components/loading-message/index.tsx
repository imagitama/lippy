import React from 'react'
import { makeStyles } from '@mui/styles'

import Message from '@/components/message'

const useStyles = makeStyles({
  icon: {
    height: '2em !important',
  },
})

const LoadingMessage = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles()
  return <Message>{children || 'Loading...'}</Message>
}

export default LoadingMessage
