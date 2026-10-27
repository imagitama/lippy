export type VrchatGroupEventAccessType = 'group' | 'public'

export enum VrchatGroupEventCategory {
  Arts = 'arts',
  Avatars = 'avatars',
  Dance = 'dance',
  Education = 'education',
  Exploration = 'exploration',
  FilmMedia = 'film_media',
  Gaming = 'gaming',
  Hangout = 'hangout',
  Music = 'music',
  Other = 'other',
  Performance = 'performance',
  Roleplaying = 'roleplaying',
  Wellness = 'wellness',
}

export type VrchatGroupEventOccurrenceKind = 'occurrence' | 'series' | 'single'

/** e.g. "cal_6b182f0c-61ef-4bdf-97fe-94f63bcba27b" */
export type VrchatCalendarId = string
/** e.g. "file_ce35d830-e20a-4df0-a6d4-5aaef4508044" */
export type VrchatFileId = string
/** e.g. "grol_459d3911-f672-44bc-b84d-e54ffe7960fe" */
export type VrchatGroupRoleId = string
/** e.g. "grp_71a7ff59-112c-4e78-a990-c7cc650776e5" */
export type VrchatGroupId = string
/** e.g. "eng" */
export type VrchatLanguageCode = string
/** e.g. "android" (see CalendarEventPlatform in the VRChat API docs for the full set) */
export type VrchatCalendarEventPlatform = string
export type VrchatTag = string

export interface VrchatGroupEventRecurrenceEnd {
  count?: number
  /** ISO date-time without offset, e.g. "2026-12-31T23:59:00" */
  date?: string
  type: string // e.g. "afterOccurrences"
}

export interface VrchatGroupEventRecurrence {
  /** e.g. ["FR"] */
  daysOfWeek?: string[]
  end?: VrchatGroupEventRecurrenceEnd
  /** e.g. "weekly" */
  frequency?: string
  interval?: number
  /** IANA timezone, e.g. "America/Chicago" */
  timezone?: string
}

/** The currently logged in user's interest in an event. */
export interface VrchatGroupEventUserInterest {
  createdAt?: string // date-time
  isFollowing?: boolean
  updatedAt?: string // date-time
}

export interface VrchatGroupEvent {
  /** Who the event is for. Default: "public" */
  accessType: VrchatGroupEventAccessType
  /** The activity intended to take place at the event. Default: "other" */
  category: VrchatGroupEventCategory
  closeInstanceAfterEndMinutes?: number
  /** date-time */
  createdAt?: string
  /** date-time */
  deletedAt?: string | null
  description: string
  /** int64 */
  durationInMs?: number
  /** date-time */
  endsAt: string
  featured?: boolean
  guestEarlyJoinMinutes?: number
  hostEarlyJoinMinutes?: number
  id: VrchatCalendarId
  imageId?: VrchatFileId | null
  imageUrl?: string
  interestedUserCount?: number
  isDraft?: boolean
  /** Languages that might be spoken at this event */
  languages?: VrchatLanguageCode[]
  /**
   * "single" is a standalone event, "series" is the parent spec of a
   * recurring series, "occurrence" is an individual event in a series.
   * Default: "single"
   */
  occurrenceKind?: VrchatGroupEventOccurrenceKind
  occurrenceModified?: boolean
  ownerId?: VrchatGroupId
  platforms?: VrchatCalendarEventPlatform[]
  recurrence?: VrchatGroupEventRecurrence | null
  /** Group roles that may join this event */
  roleIds?: VrchatGroupRoleId[] | null
  seriesId?: VrchatCalendarId | null
  /** date-time */
  startsAt: string
  /** Custom tags for this event */
  tags?: VrchatTag[]
  /** minLength: 1 */
  title: string
  type?: string
  /** date-time */
  updatedAt?: string
  userInterest?: VrchatGroupEventUserInterest
  usesInstanceOverflow?: boolean
}
