import { type Event } from './events.ts'
import type {
  VrchatGroupAccessType,
  VrchatInstance,
  VrchatInstanceCachedItem,
  VrchatInstanceType,
} from './vrchat-cache.ts'

export interface GetWorldDataRecord extends Record<string, unknown> {
  isalpha: boolean
  atlascount: number
  events: string // JSON - WorldDataEvent[]
  lastmodifiedat: string | null // date
  generatedat: string // date
}

export interface VrchatInstanceForWorld {
  name: string
  type: VrchatInstanceType
  groupaccesstype: VrchatGroupAccessType | null
  worldname: string
  playercapacity: number
  playercount: number
  // queuecapacity: number | null TODO: not exposed in API?
  queuecount: number | null
  lastupdatedat: string // date
}

export interface WorldDataEvent {
  id: string
  name: string
  startsat: string
  endsat: string
  clubname: string
  vrchatgroupid: string // from parent club
  vrchatinstanceid: string | null // can be auto populated from VRChat group instance
  atlas: {
    idx: number
    x: number
    y: number
  } | null
  vrchatinstance: VrchatInstanceForWorld | null
  accentcolor: [number, number, number] | null
}

export interface EventToSend extends Event {
  vrchatgroupid: string // from parent club
}

export interface EventAlphaOrBeta extends Record<string, unknown> {
  eventid: string
  atlas: {
    idx: number
    x: number
    y: number
  } | null
  addedat: string // date
}

export interface EventAlphaOrBetaForWorld extends EventAlphaOrBeta {
  vrchatgroupid: string // from parent club
  event: Event
  clubname: string
  clubcolor: [number, number, number] | null
  vrchatinstancecache: VrchatInstanceCachedItem | null
}

// for display on website
export interface FullEventAlphaOrBeta extends EventAlphaOrBetaForWorld {
  event: Event
}

export enum ViewNames {
  // GetWorldData = 'getworlddata',
  GetEventsForWorld = 'geteventsforworld',
  // GetQueuedEvents = 'getqueuedevents',
  GetAlphaEventsForWorld = 'getalphaeventsforworld',
  GetBetaEventsForWorld = 'getbetaeventsforworld',
  GetFullAlphaEvents = 'getfullalphaevents', // for output /world
  GetFullBetaEvents = 'getfullbetaevents', // for output /world
}

export enum CollectionNames {
  WorldData = 'worlddata',
  Events = 'events',
  // EventQueue = 'event_queue',
  EventsAlpha = 'events_alpha',
  EventsBeta = 'events_beta',
}

export enum BucketNames {
  Atlasses = 'atlasses',
}
