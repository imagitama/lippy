import type { Club, ClubMeta } from './clubs.ts'
import { FeaturedStatus } from './common.ts'
import type { FullPerformance } from './performances.ts'
import type { VrchatInstanceCachedItem } from './vrchat-cache.ts'

export const EVENT_BANNER_WIDTH = 600
export const EVENT_BANNER_HEIGHT = 300

export enum EventCategory {
  Music = 'music',
  Other = 'other',
}

export interface EventFields extends Record<string, unknown> {
  clubid: string
  vrchatinstanceid: string | null // null to find VRC group instance
  name: string
  description: string
  category: EventCategory
  sourceurl: string
  thumbnailurl: string
  posterurl: string | null
  attachmentids: string[]
  isadult: boolean
  startsat: string // date
  endsat: string // date
  slug: string
  isbackground: boolean
  genres: string[]
  tags: string[]
}

export interface Event extends EventFields {
  id: string
  lastmodifiedat: string | null // date
  lastmodifiedby: string | null
  createdat: string // date
  createdby: string
}

export interface EventMeta {
  id: string
  modnotes: string | null
  approvalstatus: string
  accessstatus: string
  featuredstatus: FeaturedStatus
  lastmodifiedat: string | null // date
  lastmodifiedby: string | null
  createdat: string // date
  createdby: string
}

export interface EventForList extends Event {
  featuredstatus: FeaturedStatus
  clubname: string
  clubthumbnailurl: string | null
  vrchatinstancecache: VrchatInstanceCachedItem | null
  fullperformances: FullPerformance[]
}

export interface PublicEvent extends EventForList {}

export interface FullEvent extends Event, EventMeta {
  fullperformances: FullPerformance[]
  club:
    | null
    | (Pick<
        Club,
        // meta
        | 'name'
        | 'thumbnailurl'
        | 'createdby'
        // perms
        | 'owneruserids'
        | 'moduserids'
        | 'vrchatowneruserids'
        | 'vrchatmoduserids'
      > &
        Pick<ClubMeta, 'vrchatownerid'>)
  vrchatinstancecache: VrchatInstanceCachedItem | null
  attendance: FullEventAttendance[]
}

export enum AttendanceStatus {
  Accepted = 'accepted',
  Maybe = 'maybe',
  Declined = 'declined',
}

export namespace AttendanceStatus {
  export const Abstain: AttendanceStatus = 'abstain' as AttendanceStatus
}

export interface EventAttendance extends Record<string, any> {
  id: string
  eventid: string
  status: AttendanceStatus
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

export interface FullEventAttendance extends EventAttendance {
  createdbyusername: string
  createdbyavatarurl: string
}

export enum CollectionNames {
  Events = 'events',
  EventsMeta = 'eventsmeta',
  EventAttendance = 'eventattendance',
}

export enum ViewNames {
  GetFullEvents = 'getfullevents',
  GetEventsForList = 'geteventsforlist',
  GetPublicEvents = 'getpublicevents',
  GetMyEvents = 'getmyevents',
  GetFullEventAttendance = 'getfulleventattendance',
}

export enum BucketNames {
  EventThumbnails = 'event-thumbnails',
  EventPosters = 'event-posters',
}

export enum FunctionNames {
  GetEventsByPerformer = 'geteventsbyperformer', // returns PublicEvent[]
}
