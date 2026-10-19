import { useCallback, useState } from 'react'
import { getIsUuid } from '@/utils'

import { CollectionNames, User } from 'shared/modules/users'
import useDataStore from '@/hooks/useDataStore'

import Button, { DeleteButton } from '@/components/button'
import SearchForIdForm from '@/components/search-for-id-form'
import NoResultsMessage from '@/components/no-results-message'
import UsernameLink from '@/components/username-link'
import { SupabaseClient } from '@supabase/supabase-js'
import LoadingIndicator from '@/components/loading-indicator'
import ErrorMessage from '@/components/error-message'
import TextInput from '@/components/text-input'
import Paper from '@/components/paper'
import InfoMessage from '@/components/info-message'
import Table, { TableBody, TableRow, TableCell } from '../responsive-table'

const useUsers = (
  userIds: string[]
): [boolean, string | null, User[] | null, ...any] => {
  const getQuery = useCallback(
    (supabase: SupabaseClient) =>
      userIds.length === 0
        ? null
        : supabase
            .from(CollectionNames.Users)
            .select('*')
            .or(userIds.map((id) => `id.eq.${id}`).join(',')),
    [userIds.join(',')]
  )
  return useDataStore<User>(getQuery, { queryName: 'users' })
}

const ClubPermissionsEditor = ({
  value,
  onChange,
  vrchatGroupId,
}: {
  value: string[]
  onChange: (val: string[]) => void
  vrchatGroupId: string | null
}) => {
  const onRemove = (userId: string) =>
    onChange(value.filter((id) => id !== userId))
  const onAdd = (userId: string) =>
    !value.includes(userId) ? onChange(value.concat([userId])) : {}

  const [isLoading, lastErrorCodeUsers, users] = useUsers(value)

  const [manualVal, setManualVal] = useState('')
  const onManualAdd = () => {
    if (!getIsUuid(manualVal)) return
    onAdd(manualVal)
  }

  if (isLoading) return <LoadingIndicator message="Loading users..." />
  if (lastErrorCodeUsers)
    return (
      <ErrorMessage errorCode={lastErrorCodeUsers}>
        Failed to load users
      </ErrorMessage>
    )

  return (
    <>
      {value.length ? (
        <Table size="small" noMinWidth>
          <TableBody>
            {value.length ? (
              value.map((userId) => {
                const user = users?.find((u) => u.id === userId)
                return (
                  <TableRow key={userId}>
                    <TableCell>
                      <UsernameLink
                        username={user?.username || '(no username)'}
                        id={userId}
                      />
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        onClick={() => onRemove(userId)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <NoResultsMessage>No roles yet</NoResultsMessage>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <NoResultsMessage>No users configured yet</NoResultsMessage>
      )}
      <Paper>
        Search for a user:
        <br />
        <SearchForIdForm
          collectionName={CollectionNames.Users}
          fieldAsLabel="username"
          onClickWithIdAndDetails={(id, user) => {
            onAdd(id)
          }}
        />
      </Paper>
      {/* <Paper>
        You can paste a user ID here (not a VRChat user ID - ours!):
        <br />
        <TextInput
          label="Enter user ID manually"
          value={manualVal}
          onChange={(e) => setManualVal(e.target.value)}
          button={<Button onClick={() => onManualAdd()}>Add</Button>}
        />
      </Paper> */}
    </>
  )
}

export default ClubPermissionsEditor
