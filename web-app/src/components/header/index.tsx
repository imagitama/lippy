import React from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@mui/styles'
import { useMediaQuery } from 'react-responsive'
import MenuIcon from '@mui/icons-material/Menu'
import GitHubIcon from '@mui/icons-material/GitHub'

import store from '@/store'
import * as routes from '@/routes'
import { openMenu } from '@/slices/app'
import { ReactComponent as Logo } from '@/assets/images/logo_v1.svg'
import {
  queryForMobiles,
  mediaQueryForMobiles,
  mediaQueryForDesktopsOnly,
} from '@/media-queries'
import { trackAction } from '@/analytics'

import Link from '@/components/link'
import MobileMenu from '@/components/mobile-menu'
import AccountMenu from '@/components/account-menu'
import DesktopMenu from '@/components/desktop-menu'
import { colorBrandLight, specialFontFamily } from '@/themes'

const useStyles = makeStyles({
  root: {
    height: '2rem',
    padding: '0 0.5rem',
    display: 'flex',
    position: 'relative',
    [mediaQueryForMobiles]: {
      height: '44px', // room for menu button
      flexDirection: 'column',
    },
    '& a': {
      textDecoration: 'none',
    },
  },
  menu: {
    width: '100%',
  },
  searchBar: {
    width: '100%',
  },
  desktopMenu: {
    width: '100%',
  },
  logo: {
    height: '100%', // mobile
    marginRight: '0.5rem',
    '& svg': {
      width: '1em',
      height: '1em',
      fontSize: '200%',
      marginRight: '0.25rem',
      // [mediaQueryForMobiles]: {
      //   marginRight: '0.1rem',
      // },
    },
    transition: 'all 100ms',
    '&:hover': {
      opacity: 1,
      animation: '$wiggle 500ms',
    },
    '& a': {
      height: '100%', // mobile
      display: 'flex',
      alignItems: 'center',
      color: colorBrandLight,
      fontFamily: specialFontFamily,
      lineHeight: 1,
    },
    [mediaQueryForMobiles]: {
      width: '75px', // anchor will fill the entire header
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
    width: '44px', // minimum height for accessibility
    height: '44px',
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
