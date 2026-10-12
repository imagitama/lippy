import { type Event } from './events.ts'

export interface GetWorldDataRecord extends Record<string, unknown> {
  isalpha: boolean
  atlascount: number
  events: string // JSON - WorldDataEvent[]
  lastmodifiedat: string | null // date
  generatedat: string // date
}

export interface WorldDataEvent {
  id: string
  name: string
  startsat: string
  endsat: string
  vrchatgroupid: string // from parent club
  vrchatinstanceid: string | null // can be auto populated from VRChat group instance
  atlas: {
    idx: number
    x: number
    y: number
  } | null
}

export interface EventToSend extends Event {
  vrchatgroupid: string // from parent club
}

// export interface QueuedEvent {
//   eventid: string
//   queuedat: string // date
// }

// interface QueuedEventWithEvent extends QueuedEvent, Event {}

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
}

// for display /world
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
