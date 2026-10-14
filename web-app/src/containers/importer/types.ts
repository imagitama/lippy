export interface ExternalPerformer {
  id: number
  order: number
  performerId: number
}

export interface ExternalEventSlot {
  id: number | string // numeric for performer slots, e.g. "29705-doors" for doors
  start: number // unix seconds
  duration: number // seconds
  performers: ExternalPerformer[]
  order: number
  flag: 'doors' | 'performers' | (string & {})
  note: string | null
}

export interface ExternalEventUrls {
  twitter: string | null
  discord: string | null
  blueSky: string | null
  instagram: string | null
  vrcGroup: string | null
  vrcInstance: string | null
  vrcInstanceNotSet: string | null
  vrcUser: string | null
}

export interface ExternalEvent {
  id: number
  name: string
  description: string | null
  category: number
  tags: number[]
  organizers: number[]
  hostOrganizer: number
  start: number // unix seconds
  end: number // unix seconds
  duration: number // seconds
  urls: ExternalEventUrls
  poster: string | null
  isHighlighted: boolean
  extensions: {
    performerSlots: boolean
  }
  promoted: boolean
  // Absent on events with no performer slots (e.g. workouts / yoga)
  eventSlots?: ExternalEventSlot[]
  showSlots?: boolean
}

export interface ExternalPerformerInfo {
  id: number
  hidden: boolean
  name: string
}

export interface ExternalData {
  eventData: {
    events: ExternalEvent[]
    performers: ExternalPerformerInfo[]
  }
}
