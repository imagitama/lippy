import { EventFieldsResult } from './map'

export interface ImporterDetails {
  eventid: string
  externalid: number
  createdat: string
  createdby: string
}

export enum CollectionNames {
  ImporterDetails = 'importerdetails',
}

export enum FunctionNames {
  ImportExternalEvent = 'importexternalevent',
}

export interface ImportExternalEventPayload {
  p_ev: EventFieldsResult
  p_externalid: number
}

export interface ImportExternalEventResult {
  success: boolean
  eventid: string // uuid
}
