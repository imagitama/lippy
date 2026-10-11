import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    padding: '20%',
    background: '#626262',
    overflow: 'hidden',
    '& svg': {
      width: '100%',
      height: '100%',
      display: 'block',
      opacity: 1,
      '& path': {
        stroke: '#FFF !important',
      },
    },
  },
  option_0: {
    '& svg': {
      transform: 'scale(0.8)',
    },
  },
  option_1: {
    '& svg': {
      transform: 'scale(0.9)',
    },
  },
})

export const DefaultAvatar = ({
  stringForDecision,
}: {
  stringForDecision?: string
}) => {
  const idx = null
  const classes = useStyles()
  return (
    <div
      className={`${classes.root} ${
        // @ts-ignore
        idx !== null ? classes[`option_${idx}`] : ''
      }`}>
      {null}
    </div>
  )
}

export default DefaultAvatar
