export interface PerformanceFields extends Record<string, any> {
  eventid: string // uuid
  performerid: string | null
  name: string | null
  startsat: string // date
  endsat: string // date
  genres: string[]
}

export interface Performance extends PerformanceFields {
  id: string
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

export interface FullPerformance extends Performance {
  fullperformername: string | null
}

export enum CollectionNames {
  Performances = 'performances',
}

export enum ViewNames {
  GetFullPerformances = 'getfullperformances',
}
