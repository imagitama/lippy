import React from 'react'

import { CollectionNames } from 'shared/modules/users'
import useIsModerator from '@/hooks/useIsModerator'
import AdminGenericHistory from '@/components/admin-generic-history'
import useUserOverview from '../../useUserOverview'

export default () => {
  const { userId, user } = useUserOverview()
  const isMod = useIsModerator()

  if (!isMod || !userId || !user) {
    return null
  }

  return (
    <AdminGenericHistory
      id={userId}
      type={CollectionNames.Users}
      metaType={CollectionNames.UsersMeta}
    />
  )
}
