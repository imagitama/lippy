import { EventCategory, EventFields, Performance } from 'shared/modules/events'
import { ExternalData, ExternalEvent, ExternalEventSlot } from './types'

export type EventFieldsResult = Pick<
  EventFields,
  // | "clubid"
  | 'vrchatinstanceid'
  | 'name'
  | 'description'
  | 'posterurl'
  | 'category'
  | 'attachmentids'
  | 'startsat'
  | 'endsat'
  | 'isbackground'
  | 'genres'
  | 'tags'
  | 'performances'
>

const toIso = (unixSeconds: number): string =>
  new Date(unixSeconds * 1000).toISOString()

const getPerformerName = (
  performerId: number,
  fullData: ExternalData
): string | null =>
  fullData.eventData.performers.find((perf) => perf.id === performerId)?.name ??
  null

const getPerformancesFromSlots = (
  slots: ExternalEventSlot[],
  fullData: ExternalData
): Performance[] =>
  slots
    .filter((slot) => slot.flag === 'performers' && slot.performers.length > 0)
    .flatMap((slot) => {
      const startsat = toIso(slot.start)
      const endsat = toIso(slot.start + slot.duration)

      return [...slot.performers]
        .sort((a, b) => a.order - b.order)
        .map((p) => ({
          performerid: null,
          performername: getPerformerName(p.performerId, fullData),
          startsat,
          endsat,
        }))
    })

export const getCategoryForExternalCategory = (
  externalCategory: number
): EventCategory => {
  switch (externalCategory) {
    case 1:
      return EventCategory.Music
    default:
      return EventCategory.Other
  }
}

const EXTERNAL_TAG_MAP: Record<number, string> = {
  // Platform (group 2)
  7: 'quest_compatible',
  15: 'ios_compatible',

  // Content rating (groups 1 and 4)
  1: 'nsfw_allowed',
  5: '18plus', // "Age gated"

  // Flashing lights (group 5)
  8: 'no_flash',
  9: 'mild_flashing_lights',
  10: 'severe_flashing_lights',
  11: 'flashing_lights_toggle',

  // Avatar performance (group 6)
  12: 'no_avatar_restriction',
  13: 'poor_or_better',
  14: 'medium_or_better',

  // Misc
  4: 'open_decks',
}

export const getTagsFromExternalTags = (tags: number[]): string[] =>
  tags.flatMap((t) => (EXTERNAL_TAG_MAP[t] ? [EXTERNAL_TAG_MAP[t]] : []))

// The document contains no genre data. Its tags and categories (Music, Podcast,
// Roleplay, Fitness, Community, Theatre & Art) describe event types, not genres.
// Fill this in if the API exposes genres elsewhere (e.g. on the event or
// performer objects).
const EXTERNAL_GENRE_MAP: Record<number, string> = {
  // 2: "...",
}

export const getGenresFromExternalTags = (tags: number[]): string[] =>
  tags.flatMap((t) => (EXTERNAL_GENRE_MAP[t] ? [EXTERNAL_GENRE_MAP[t]] : []))

type Mapping = {
  [T in keyof ExternalEvent]-?: {
    [O in keyof EventFields]-?: {
      theirName: T
      ourName: O
      map: (val: ExternalEvent[T], fullData: ExternalData) => EventFields[O]
    }
  }[keyof Event]
}[keyof ExternalEvent]

const mappings: Mapping[] = [
  { theirName: 'name', ourName: 'name', map: (v) => v },
  { theirName: 'description', ourName: 'description', map: (v) => v ?? '' },
  {
    theirName: 'category',
    ourName: 'category',
    map: getCategoryForExternalCategory,
  },
  { theirName: 'start', ourName: 'startsat', map: toIso },
  { theirName: 'end', ourName: 'endsat', map: toIso },
  { theirName: 'tags', ourName: 'genres', map: getGenresFromExternalTags },
  { theirName: 'tags', ourName: 'tags', map: getTagsFromExternalTags },
  {
    theirName: 'eventSlots',
    ourName: 'performances',
    map: (maybeSlots, fullData) =>
      getPerformancesFromSlots(maybeSlots || [], fullData),
  },
]

export const getEventFieldsFromExternalEvent = (
  event: ExternalEvent,
  fullData: ExternalData
): EventFieldsResult => {
  const result: any = {}

  for (const { theirName, ourName, map } of mappings) {
    result[ourName] = (map as (val: unknown, ev: unknown) => unknown)(
      event[theirName],
      fullData
    )
  }

  return result as EventFieldsResult
}
