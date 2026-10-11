export interface AnalyticsEntryFields extends Record<string, any> {
  category: string
  action: string
  parenttable: string
  parentid: string
  extradata: any
}

export interface AnalyticsEntry {
  id: string
}

export type SourceTotals = { [url: string]: number }

export enum CollectionNames {
  Analytics = 'analytics',
}

export enum ViewNames {}
