import React from 'react'
import EventIcon from '@mui/icons-material/Event'
import ApartmentIcon from '@mui/icons-material/Apartment'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import JoinIcon from '@kurone-kito/launchpad-icons-react/dist/Join'

import { MyUser, UserRoles } from 'shared/modules/users'
import * as routes from './routes'
import { DISCORD_URL, JOIN_VRCHAT_WORLD_URL } from './config'

export interface MenuItem {
  id: string
  label: string
  url?: string
  requiresAuth?: boolean
  requiresNotAuth?: boolean
  requiresModerator?: boolean
  requiresAdmin?: boolean
  requiresAdminOrEditor?: boolean
  requiresAdultContentEnabled?: boolean
  children?: MenuItem[]
  icon?: React.ComponentType
}

export function canShowMenuItem(
  menuItem: MenuItem,
  user: MyUser | null
): boolean {
  if (menuItem.requiresAuth && !user) {
    return false
  }
  if (menuItem.requiresNotAuth && user) {
    return false
  }
  if (
    menuItem.requiresModerator &&
    (!user ||
      (user.role !== UserRoles.Moderator && user.role !== UserRoles.Admin))
  ) {
    return false
  }
  if (menuItem.requiresAdmin && (!user || user.role !== UserRoles.Admin)) {
    return false
  }
  if (menuItem.requiresAdminOrEditor) {
    if (!user) {
      return false
    }
    if (user.role === UserRoles.Admin || user.role === UserRoles.Moderator) {
      return true
    }
    return false
  }
  if (
    menuItem.requiresAdultContentEnabled &&
    user?.enabledadultcontent === true
  ) {
    return true
  }
  return true
}

const items: MenuItem[] = [
  {
    id: 'vrc-world',
    url: JOIN_VRCHAT_WORLD_URL,
    label: 'VRC World',
    icon: JoinIcon,
  },
  {
    id: 'events',
    url: routes.home,
    label: 'Timeline',
    icon: EventIcon,
  },
  {
    id: 'clubs',
    url: routes.clubs,
    label: 'Clubs',
    icon: ApartmentIcon,
  },
  {
    id: 'performers',
    url: routes.performers,
    label: 'Performers',
    icon: EmojiPeopleIcon,
  },
  {
    id: 'more',
    label: 'More',
    children: [
      {
        id: 'calendar',
        url: routes.events,
        label: 'Event Calendar',
      },
      {
        id: 'users',
        url: routes.users,
        label: 'Users',
      },
      {
        id: 'about',
        url: routes.about,
        label: 'About',
      },
      // {
      //   id: 'discord',
      //   url: DISCORD_URL,
      //   label: 'Our Discord',
      // },
      // {
      //   id: 'patreon',
      //   url: routes.patreon,
      //   label: 'Patreon',
      // },
      {
        id: 'admin',
        label: 'Admin',
        url: routes.admin,
        requiresModerator: true,
      },
    ],
  },
]

export default items
