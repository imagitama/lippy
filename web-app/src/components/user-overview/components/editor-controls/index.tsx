import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import CommentIcon from '@mui/icons-material/Comment'
import Table from '@/components/responsive-table'
import TableBody from '@mui/material/TableBody'
import { TableCell } from '@/components/responsive-table'
import { TableRow } from '@/components/responsive-table'

import useIsModerator from '@/hooks/useIsModerator'
import useUserRecord from '@/hooks/useUserRecord'

import { UserRoles, PatreonStatus } from 'shared/modules/users'
import { routes } from '@/routes'

import Button from '@/components/button'
import FormattedDate from '@/components/formatted-date'

import useUserOverview from '../../useUserOverview'

const useIsAdmin = (): boolean => {
  const [, , user] = useUserRecord()
  return user ? user.role === UserRoles.Admin : false
}

const UserEditorControls = () => {
  const isMod = useIsModerator()
  const { user } = useUserOverview()
  const isAdmin = useIsAdmin()
  const [isBotScoreExpanded, setIsBotScoreExpanded] = useState(false)
  if (!isMod || !user) return null
  return (
    <>
      <Table noMinWidth>
        <TableBody>
          <TableRow>
            <TableCell>Signed up</TableCell>
            <TableCell>
              <FormattedDate date={user.createdat} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Patreon</TableCell>
            <TableCell>
              {user.patreonstatus || PatreonStatus.Unknown} (
              {user.patreonrewardids?.length
                ? user.patreonrewardids.join(',')
                : 'no rewards'}
              )
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>VRChat ID</TableCell>
            <TableCell>{user.linkedvrchatuserid || 'Not Linked'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discord ID</TableCell>
            <TableCell>{user.discorduserid || 'Not Linked'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        icon={<EditIcon />}
        color="secondary"
        url={routes.editUserWithVar.replace(':userId', user.id)}>
        Edit User
      </Button>{' '}
      <Button
        icon={<CommentIcon />}
        color="secondary"
        url={`${routes.adminWithTabNameVar.replace(
          ':tabName',
          'users'
        )}?userId=${user.id}`}>
        View Comments
      </Button>{' '}
    </>
  )
}

export default UserEditorControls
