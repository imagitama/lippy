import React from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@mui/styles'
import { useMediaQuery } from 'react-responsive'
import MenuIcon from '@mui/icons-material/Menu'
import GitHubIcon from '@mui/icons-material/GitHub'

import store from '@/store'
import * as routes from '@/routes'
import { openMenu } from '@/slices/app'
import { ReactComponent as DiscordIcon } from '@/assets/images/icons/discord.svg'
import { ReactComponent as PatreonIcon } from '@/assets/images/icons/patreon.svg'
import { ReactComponent as Logo } from '@/assets/images/logo_v1.svg'
import {
  queryForMobiles,
  mediaQueryForMobiles,
  mediaQueryForDesktopsOnly,
} from '@/media-queries'
import { trackAction } from '@/analytics'
import {
  DISCORD_URL,
  GITHUB_REPO_URL,
  PATREON_BECOME_PATRON_URL,
} from '@/config'

import Link from '@/components/link'
import MobileMenu from '@/components/mobile-menu'
import AccountMenu from '@/components/account-menu'
import DesktopMenu from '@/components/desktop-menu'
import VrchatGroupButton from '@/components/vrchat-group-button'
import { colorBrand, colorBrandLight, specialFontFamily } from '@/themes'

// when the navigation starts obstructing the logo
const mediaQueryForMenuLogoCollision = '@media (max-width: 1280px)'

const useStyles = makeStyles({
  root: {
    height: '30px',
    padding: '0 0.5rem',
    display: 'flex',
    position: 'relative',
    [mediaQueryForMobiles]: {
      flexDirection: 'column',
    },
    '& a': {
      textDecoration: 'none',
    },
  },
  cols: {
    display: 'flex',
    [mediaQueryForMobiles]: {
      flexWrap: 'wrap',
    },
  },
  menu: {
    width: '100%',
  },
  leftCol: {
    flexShrink: 1,
    marginRight: '2%',
  },
  rightCol: {
    width: '100%',
  },
  searchBar: {
    width: '100%',
  },
  desktopMenu: {
    width: '100%',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'start',
    top: 0,
    left: 0,
    [mediaQueryForMobiles]: {
      position: 'relative',
      padding: 0,
    },
    '& a': {
      height: '100%',
      display: 'flex',
    },
  },
  socialIcons: {
    marginLeft: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    '& a': {
      display: 'flex',
      alignItems: 'center',
      padding: '0 0.25rem',
      opacity: '0.75',
      transition: 'opacity 200ms',
      '&:hover': {
        opacity: 1,
      },
    },
    '& .twitterIconLink': {
      paddingRight: '0.25rem',
    },
    '& svg': {
      width: 'auto', // fix patreon icon
      height: '2em',
    },
    '& .twitterIcon': {
      height: '1.5em',
    },
    '& path': {
      fill: '#FFF',
    },
  },
  twitterIconLink: {},
  twitterIcon: {},
  logo: {
    marginRight: '0.5rem',
    '& svg': {
      width: '1em',
      height: '1em',
      fontSize: '200%',
      marginRight: '0.1rem',
    },
    transition: 'all 100ms',
    '&:hover': {
      opacity: 1,
      animation: '$wiggle 500ms',
    },
    '& a': {
      display: 'flex',
      alignItems: 'center',
      color: colorBrandLight,
      fontFamily: specialFontFamily,
      lineHeight: 1,
    },
  },
  '@keyframes wiggle': {
    '0%': { transform: 'rotate(0deg)' },
    '15%': { transform: 'rotate(6deg)' },
    '30%': { transform: 'rotate(-5deg)' },
    '45%': { transform: 'rotate(4deg)' },
    '60%': { transform: 'rotate(-3deg)' },
    '75%': { transform: 'rotate(2deg)' },
    '90%': { transform: 'rotate(-1deg)' },
    '100%': { transform: 'rotate(0deg)' },
  },
  menuToggleButton: {
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    right: 0,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },

    [mediaQueryForDesktopsOnly]: {
      display: 'none',
    },
  },
  menuToggleIcon: {
    width: '4rem',
    height: '3rem',
    fill: '#FFF',
  },
  invisible: {
    visibility: 'hidden',
  },
  homepage: {
    top: '100%',
  },
  socialMediaRows: {
    [mediaQueryForMobiles]: {
      display: 'flex',
    },
  },
  searchbarWrapper: {
    width: '100%',
    [mediaQueryForMobiles]: {
      width: '100%',
      margin: '0.5rem auto 0',
      padding: 0,
    },
  },
  vrchatGroupButton: {
    fontSize: '0.5rem',
    margin: '0.5rem 0 0 0.5rem',
    [mediaQueryForMobiles]: { margin: 0 },
    opacity: '0.75',
    transition: 'opacity 200ms',
    '&:hover': {
      opacity: 1,
    },
  },
  accountMenu: {
    flexShrink: 0,
  },
})

export default () => {
  const classes = useStyles()
  const dispatch = useDispatch<typeof store.dispatch>()
  const isMobile = useMediaQuery({ query: queryForMobiles })
  const dispatchOpenMenu = () => dispatch(openMenu())

  const onToggleMobileMenuClick = () => {
    dispatchOpenMenu()
    trackAction('Header', 'Click open mobile menu button')
  }

  return (
    <header className={classes.root}>
      <div className={classes.logo}>
        <Link to={routes.home}>
          <span>
            <Logo />
          </span>{' '}
          <span>Lippy</span>
        </Link>
      </div>
      <div className={classes.menu}>
        {isMobile ? <MobileMenu /> : <DesktopMenu />}
      </div>
      <div className={classes.accountMenu}>
        {isMobile ? (
          <div
            className={classes.menuToggleButton}
            onClick={onToggleMobileMenuClick}>
            <MenuIcon className={classes.menuToggleIcon} />
            <span hidden>Menu</span>
          </div>
        ) : (
          <AccountMenu />
        )}
      </div>
    </header>
  )
}
