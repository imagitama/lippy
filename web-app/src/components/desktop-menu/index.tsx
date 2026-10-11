import { useHistory } from 'react-router-dom'
import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { makeStyles } from '@mui/styles'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import useUserRecord from '@/hooks/useUserRecord'

import navItems, {
  MenuItem as NavMenuItem,
  canShowMenuItem,
} from '@/navigation'
import { trackAction } from '@/analytics'
import Link from '@/components/link'
import { specialFontFamily } from '@/themes'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  menuItem: {
    whiteSpace: 'nowrap',
    '&:first-child': {
      menuItemLabel: {
        paddingLeft: 0,
      },
    },
    fontFamily: specialFontFamily,
    '& svg': {
      // fix Join icon
      width: '1em',
      height: '1em',
    },
  },
  menuItemLabel: {
    padding: '0.25rem 0.5rem',
    opacity: 1,
    color: 'inherit',
    display: 'flex', // for icon
    alignItems: 'center',
    textAlign: 'center',
    textShadow: '1px 1px 2px #000',
    transition: '100ms all',
    '&:hover': {
      cursor: 'pointer',
      opacity: '1 !important',
    },
    // '& svg': {
    //   fontSize: '150%',
    // },
  },
  twitterBtn: {
    paddingLeft: '1rem',
    marginTop: '0.4rem',
  },
})

const MenuItemLabel = styled.span`
  display: flex;
  align-items: center;
  & svg {
    margin-right: 0.25rem;
  }
`

function Dropdown({
  label,
  items,
  isOpen,
  onOpen,
  onClose,
}: {
  label: string
  items: NavMenuItem[]
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const { push } = useHistory()
  const labelRef = useRef<HTMLSpanElement>(null)
  const classes = useStyles()

  const onClickItem = (url: string) => {
    push(url)
    onClose()
  }

  return (
    <>
      <span ref={labelRef} onClick={onOpen} className={classes.menuItemLabel}>
        {label} <KeyboardArrowDownIcon />
      </span>
      <Menu
        anchorEl={labelRef.current}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={onClose}>
        {!Array.isArray(items)
          ? React.createElement(items, { onClose })
          : items.map(({ label, url, icon }) => (
              <MenuItem
                key={url}
                onClick={url ? () => onClickItem(url) : undefined}>
                {icon && React.createElement(icon)}
                {label}
              </MenuItem>
            ))}
      </Menu>
    </>
  )
}

const DesktopMenu = () => {
  const classes = useStyles()
  const [, , user] = useUserRecord()
  const [openMenuItem, setOpenMenuItem] = useState<string | null>(null)

  const closeMenuDropdown = () => {
    setOpenMenuItem(null)
  }

  return (
    <div className={classes.root}>
      {navItems
        .filter((navItem) => canShowMenuItem(navItem, user))
        .map(({ id, label, url, children, icon }) => {
          const actualLabel = (
            <MenuItemLabel>
              {icon && React.createElement(icon)}
              {label}
            </MenuItemLabel>
          )

          const Anchor = ({ children }: { children: React.ReactNode }) =>
            url && url.includes('http') ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.menuItemLabel}
                onClick={() =>
                  trackAction('DesktopMenu', 'Click external link', url)
                }>
                {children}
              </a>
            ) : url ? (
              <Link
                to={url}
                className={classes.menuItemLabel}
                onClick={() =>
                  trackAction('DesktopMenu', 'Click menu item', id)
                }>
                {children}
              </Link>
            ) : (
              <>(no URL)</>
            )

          return (
            <div key={id} className={classes.menuItem}>
              {children ? (
                <Dropdown
                  label={actualLabel as any}
                  items={
                    !Array.isArray(children)
                      ? children
                      : children.filter((navItem) =>
                          canShowMenuItem(navItem, user)
                        )
                  }
                  isOpen={openMenuItem === id}
                  onOpen={() => {
                    setOpenMenuItem(id)
                    trackAction('DesktopMenu', 'Open dropdown menu', id)
                  }}
                  onClose={() => closeMenuDropdown()}
                />
              ) : (
                <Anchor>{actualLabel}</Anchor>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default DesktopMenu
