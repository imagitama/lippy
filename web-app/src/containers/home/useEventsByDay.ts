import { useEffect, useMemo, useRef, useState } from 'react'

import useDatabaseQuery, { Operators } from '@/hooks/useDatabaseQuery'
import { PublicEvent, ViewNames } from 'shared/modules/events'
import { TimeRange } from '@/components/horizontal-timeline'
import { HydrateFn } from '@/hooks/useDataStore'

const startOfDay = (d: Date) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n) // DST-safe, unlike adding 24h
  return x
}

// days (as local-midnight timestamps) needed to cover the range, plus a prefetch buffer
function daysCovering(start: Date, end: Date, buffer = 1): number[] {
  const out: number[] = []
  let d = addDays(startOfDay(start), -buffer)
  const last = addDays(startOfDay(end), buffer)
  while (d <= last) {
    out.push(d.getTime())
    d = addDays(d, 1)
  }
  return out
}

function useEventsByDay(
  timeRange: TimeRange | null
): [boolean, string | null, PublicEvent[] | null, HydrateFn] {
  const [cache, setCache] = useState<Map<number, PublicEvent[]>>(
    () => new Map()
  )

  const startMs = timeRange?.start.getTime()
  const endMs = timeRange?.end.getTime()
  const wanted: number[] | undefined = useMemo(
    () =>
      startMs !== undefined && endMs !== undefined
        ? daysCovering(new Date(startMs), new Date(endMs))
        : undefined,
    [startMs, endMs]
  )

  // fetch one missing day at a time
  const target = wanted?.find((d) => !cache.has(d))
  const targetStartDate = target !== undefined ? new Date(target) : undefined
  const targetEndDate = targetStartDate
    ? addDays(targetStartDate, 1)
    : undefined

  const [isLoading, lastErrorCode, events, hydrate] =
    useDatabaseQuery<PublicEvent>(
      ViewNames.GetPublicEvents,
      targetStartDate && targetEndDate
        ? [
            ['startsat', Operators.LESS_THAN, targetEndDate.toISOString()],
            ['endsat', Operators.GREATER_THAN, targetStartDate.toISOString()],
          ]
        : false,
      {
        queryName: `events-by-day`,
      }
    )

  // console.debug(`useEventsByDay`, {
  //   targetStartDate,
  //   targetEndDate,
  //   fetchedEvents: events,
  // })

  // only commit results once we've seen this target's fetch actually run,
  // so stale results from the previous day never get filed under the new one
  const sawLoading = useRef(false)
  useEffect(() => {
    sawLoading.current = false
  }, [target])

  useEffect(() => {
    if (isLoading) {
      sawLoading.current = true
      return
    }
    if (sawLoading.current && target !== undefined && !lastErrorCode) {
      sawLoading.current = false
      setCache((prev) => new Map(prev).set(target, events ?? []))
    }
  }, [isLoading, events, target, lastErrorCode])

  const allEvents = useMemo(() => {
    const byId = new Map<string, PublicEvent>()
    for (const list of cache.values()) for (const e of list) byId.set(e.id, e)
    return [...byId.values()]
    // TODO: stop subscribing to entire cache
  }, [cache])

  return [isLoading, lastErrorCode, allEvents, hydrate]
}

export default useEventsByDay
