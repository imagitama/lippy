import { CollectionNames, User } from 'shared/modules/users'
import Button, { DeleteButton } from '../button'
import SearchForIdForm from '../search-for-id-form'
import NoResultsMessage from '../no-results-message'
import UsernameLink from '../username-link'
import { SupabaseClient } from '@supabase/supabase-js'
import { useCallback, useState } from 'react'
import useDataStore from '@/hooks/useDataStore'
import LoadingIndicator from '../loading-indicator'
import ErrorMessage from '../error-message'
import TextInput from '../text-input'
import { getIsVrchatWorldId } from '@/vrchat'
import { getIsUuid } from '@/utils'
import Paper from '../paper'

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
}: {
  value: string[]
  onChange: (val: string[]) => void
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
        <ul>
          {value.map((userId) => {
            const user = users?.find((u) => u.id === userId)
            return (
              <li key={userId}>
                <UsernameLink
                  username={user?.username || '(no username)'}
                  id={userId}
                />{' '}
                <DeleteButton onClick={() => onRemove(userId)} />
              </li>
            )
          })}
        </ul>
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
      <Paper>
        You can paste a user ID here (not a VRChat user ID - ours!):
        <br />
        <TextInput
          label="Enter user ID manually"
          value={manualVal}
          onChange={(e) => setManualVal(e.target.value)}
          button={<Button onClick={() => onManualAdd()}>Add</Button>}
        />
      </Paper>
    </>
  )
}

export default ClubPermissionsEditor
