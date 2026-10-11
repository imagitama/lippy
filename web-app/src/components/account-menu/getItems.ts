import { deleteRecord } from '@/data-store'
import { handleError } from '@/error-handling'
import { getUserId } from '@/auth'
import { getLabelForNotification, getLinkUrl } from '@/notifications'
import {
  FullNotification,
  CollectionNames as NotificationsCollectionNames,
  ViewNames,
} from 'shared/modules/notifications'

import { MenuItemData } from '@/components/menu'
import { SupabaseClient } from '@supabase/supabase-js'

export const notifications = async (
  supabase: SupabaseClient
): Promise<MenuItemData[]> => {
  try {
    const userId = getUserId()

    if (!userId) {
      return []
    }

    // TODO: Use hook/abstraction
    const { data, error } = await supabase
      .from(ViewNames.GetFullNotification)
      .select<string, FullNotification<any, any>>(`*`)
      .eq('recipient', userId)
      .limit(25)

    if (!data) {
      console.warn(`Failed to get notifications for user: no data`)
      return []
    }

    if (error) {
      throw new Error('Failed to get notifications')
    }

    return data.map((notification) => ({
      id: notification.id,
      url: getLinkUrl(notification),
      label: getLabelForNotification(notification),
      date: notification.createdat,
      onRemove: async () => {
        console.debug(`removing notification ${notification.id}...`)
        await deleteRecord(
          supabase,
          NotificationsCollectionNames.Notifications,
          notification.id
        )
      },
    }))
  } catch (err) {
    console.error(err)
    handleError(err)
    return []
  }
}
