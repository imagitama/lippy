import React from 'react'
import { makeStyles } from '@mui/styles'
import { getIsUrlAbsolute } from '@/utils'
import { CustomTheme } from '@/themes'

import LazyLoad from '@/components/lazy-load'
import Link from '@/components/link'
import ErrorBoundary from '@/components/error-boundary'
import Heading from '@/components/heading'

const useStyles = makeStyles<CustomTheme>((theme) => ({
  root: {
    marginBottom: '1rem',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    '&&': {
      margin: '0 0.5rem 0 0',
    },
  },
  icon: {
    display: 'none', // to flex
    transition: 'all 100ms',
    marginLeft: '0.25rem',
    alignItems: 'center',
  },
  border: {
    borderTop: `1px solid rgba(255,255,255,0.25)`,
    width: '100%',
  },
}))

const Block = ({
  title,
  children,
  url,
  icon: Icon,
  className,
}: {
  title?: string
  children: React.ReactNode
  url?: string
  icon?: React.ReactElement
  className?: string
}) => {
  const classes = useStyles()

  const titleToRender = (
    <>
      <span>{title}</span>
      {Icon && <span className={classes.icon}>{Icon}</span>}
    </>
  )

  return (
    <ErrorBoundary>
      <LazyLoad>
        <div className={`${classes.root} ${className}`}>
          <div className={classes.titleWrapper}>
            <Heading variant="h2" className={classes.title}>
              {url ? (
                getIsUrlAbsolute(url) ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {titleToRender}
                  </a>
                ) : (
                  <Link to={url}>{titleToRender}</Link>
                )
              ) : (
                titleToRender
              )}
            </Heading>
            <div className={classes.border} />
          </div>
          {children}
        </div>
      </LazyLoad>
    </ErrorBoundary>
  )
}

export default Block
