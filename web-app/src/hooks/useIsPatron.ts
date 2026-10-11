import { CollectionNames } from 'shared/modules/users'
import { PatreonStatus, UserMeta } from 'shared/modules/users'
import useDataStoreItem from './useDataStoreItem'
import useUserId from './useUserId'

const useIsPatron = (): boolean | null => {
  const userId = useUserId()
  const [, , userMeta] = useDataStoreItem<UserMeta>(
    CollectionNames.UsersMeta,
    userId || false
  )

  return userMeta ? userMeta.patreonstatus === PatreonStatus.Patron : null
}

export default useIsPatron
