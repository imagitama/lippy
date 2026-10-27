import { getIsValidPostgresDate } from '@/utils/dates'
import { EventCategory, EventFields } from 'shared/modules/events'
import {
  VrchatGroupEvent,
  VrchatGroupEventCategory,
} from 'shared/vrchat/events'

export const getEventFromVrchatGroupEvent = (
  vrcGroupEvent: VrchatGroupEvent
): { event: Partial<EventFields>; posterImageUrl: string | null } | null => {
  const {
    id,
    ownerId,
    title,
    description,
    category,
    imageUrl,
    startsAt,
    endsAt,
    tags,
  } = vrcGroupEvent

  if (!ownerId) return null
  if (category !== VrchatGroupEventCategory.Music) return null
  if (!getIsValidPostgresDate(startsAt) || !getIsValidPostgresDate(endsAt))
    return null

  return {
    event: {
      name: title,
      description,
      category: EventCategory.Music, // other category filtered out
      sourceurl: `https://vrchat.com/home/group/${ownerId}/calendar/${id}`,
      // thumbnailurl: imageUrl ?? "",
      // posterurl: imageUrl ?? null,
      attachmentids: [],
      isadult: false,
      startsat: startsAt,
      endsat: endsAt,
      genres: [],
      tags: tags ?? [],
    },
    posterImageUrl: imageUrl ?? null,
  }
}
