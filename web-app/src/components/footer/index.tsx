import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

import * as routes from '@/routes'
import { scrollToTop } from '@/utils'
import { trackAction } from '@/analytics'
// dev tools
import { alreadyOver18Key } from '@/config'

import useStorage from '@/hooks/useStorage'
import useSupabaseUserId from '@/hooks/useSupabaseUserId'
import useIsModerator from '@/hooks/useIsModerator'
import useAccountVerification from '@/hooks/useAccountVerification'
import useIsBanned from '@/hooks/useIsBanned'

import Button from '@/components/button'
import ErrorBoundary from '../error-boundary'
import { mediaQueryForMobiles } from '@/media-queries'

const useStyles = makeStyles({
  footer: {
    height: '1.5rem',
    padding: '0.1rem 0.5rem',
    display: 'flex',
    alignItems: 'center',
    [mediaQueryForMobiles]: {
      padding: '0.1rem 0.25rem',
      fontSize: '75%',
    },
  },
  col: {
    width: '25%',
  },
  colRight: {
    width: '75%',
    textAlign: 'right',
  },
  scrollToTopBtnWrapper: {
    marginTop: '3rem',
    textAlign: 'center',
  },
})

function ScrollToTopBtn() {
  const classes = useStyles()
  const { pathname } = useLocation()

  if (pathname === '/') {
    return null
  }

  return (
    <div className={classes.scrollToTopBtnWrapper}>
      <Button
        onClick={() => {
          scrollToTop()
          trackAction('Footer', 'Click scroll to top button')
        }}
        color="secondary">
        Scroll To Top
      </Button>
    </div>
  )
}

const footerLinks = [
  {
    url: routes.takedownPolicy,
    label: 'Takedown',
  },
  {
    url: routes.privacyPolicy,
    label: 'Privacy Policy',
  },
  {
    url: routes.termsOfService,
    label: 'TOS',
  },
  {
    url: routes.dmcaPolicy,
    label: 'DMCA',
  },
  {
    url: routes.brand,
    label: 'Brand',
  },
  {
    url: routes.transparency,
    label: 'Transparency',
  },
  {
    url: routes.aiPolicy,
    label: 'AI Policy',
  },
]

function DevelopmentTools() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAlreadyOver18, setIsAlreadyOver18] = useStorage(alreadyOver18Key)
  const supabaseUserId = useSupabaseUserId()
  const isMod = useIsModerator()
  const isVerified = useAccountVerification()
  const isBanned = useIsBanned()

  if (!isExpanded)
    return (
      <Button
        size="small"
        color="secondary"
        onClick={() => setIsExpanded(true)}>
        Expand Dev Tools
      </Button>
    )

  return (
    <table>
      <tbody>
        <tr>
          <td>Is already over 18</td>
          <td>
            {isAlreadyOver18 === true ? 'Yes' : 'No'}{' '}
            <Button onClick={() => setIsAlreadyOver18(!isAlreadyOver18)}>
              Toggle
            </Button>
          </td>
        </tr>
        <tr>
          <td>Auth</td>
          <td>
            SB: {supabaseUserId}
            <br />
            Mod: {isMod ? 'Yes' : 'No'}
            <br />
            <br />
            Is verified: {isVerified ? 'Yes' : 'No'}
            <br />
            Is banned: {isBanned ? 'Yes' : 'No'}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default () => {
  const classes = useStyles()
  return (
    <ErrorBoundary>
      <ScrollToTopBtn />
      <footer className={classes.footer}>
        <div className={classes.col}>
          {process.env.NODE_ENV === 'development' && <DevelopmentTools />}
        </div>
        <div className={`${classes.col} ${classes.colRight}`}>
          &copy; {new Date().getFullYear()}{' '}
          <a href="https://www.jaredwilliams.com.au">Jared Williams</a> &ndash;{' '}
          {footerLinks.map(({ url, label }, idx) => (
            <span key={url}>
              {idx !== 0 ? <> &ndash; </> : null}
              <Link to={url}>{label}</Link>
            </span>
          ))}
        </div>
      </footer>
    </ErrorBoundary>
  )
}
