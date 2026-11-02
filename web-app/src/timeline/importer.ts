import { ExternalData, ExternalEvent } from './types'

const getExternalEventsFromData = (obj: ExternalData): ExternalEvent[] =>
  obj?.eventData?.events ?? []

export const importFromJson = (
  json: string
): { externalData: ExternalData; events: ExternalEvent[] } | null => {
  let externalData: null | ExternalData = null
  let rawEvents: null | ExternalEvent[] = null

  console.debug(`[Importer] importing from json...`)

  try {
    externalData = JSON.parse(json)
    rawEvents = getExternalEventsFromData(externalData!)

    console.debug(`[Importer] found ${rawEvents.length} events`)

    return {
      externalData: externalData!,
      events: rawEvents,
    }
  } catch (err) {
    console.warn('[Importer] Failed to parse json:', err)
    return null
  }
}
