import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Helmet } from '@unhead/react/helmet'

import { PublicEvent } from 'shared/modules/events'
import HorizontalTimeline, { TimeRange } from '@/components/horizontal-timeline'
import EventPanel from '@/components/event-panel'
import ErrorBoundary from '@/components/error-boundary'
import ErrorMessage from '@/components/error-message'

import useEventsByDay from './useEventsByDay'
import { mediaQueryForMobiles } from '@/media-queries'

// header - footer - padding
const StyledRoot = styled.div`
  position: relative;
  height: calc(100dvh - 3.5rem);
  ${mediaQueryForMobiles} {
    height: calc(100dvh - 44px - 3rem);
  }
`

const usePreventBodyScroll = () => {
  useEffect(() => {
    document.getElementById('root')!.classList.add('no-scroll')
    return () => {
      document.getElementById('root')!.classList.remove('no-scroll')
    }
  }, [])
}

const View = () => {
  const [selectedEventId, setSelectedEventId] = useState<null | string>(null)
  const [range, setRange] = useState<TimeRange | null>(null)
  const [isLoading, lastErrorCode, events, hydrate] = useEventsByDay(range)
  usePreventBodyScroll()

  const allEventsRef = useRef(new Map<string, PublicEvent>())

  const allEvents = useMemo(() => {
    if (!events) return []
    for (const event of events) allEventsRef.current.set(event.id, event)
    return [...allEventsRef.current.values()]
  }, [events?.map((ev) => ev.id).join(',')])

  const selectedEvent =
    (selectedEventId && events?.find((ev) => ev.id === selectedEventId)) || null

  // console.debug(`view.render`, { range, allEvents })

  return (
    <StyledRoot>
      {lastErrorCode !== null && (
        <ErrorMessage errorCode={lastErrorCode}>
          Failed to load events
        </ErrorMessage>
      )}
      <HorizontalTimeline
        fill
        events={allEvents}
        onEventClick={(ev) => setSelectedEventId(ev.id)}
        onRangeChange={(timeRange) => setRange(timeRange)}
        isLoading={isLoading}
        hydrate={hydrate}
      />
      {selectedEvent !== null && (
        <ErrorBoundary>
          <EventPanel
            event={selectedEvent}
            onClose={() => setSelectedEventId(null)}
          />
        </ErrorBoundary>
      )}
    </StyledRoot>
  )
}

export default () => {
  return (
    <>
      <Helmet>
        <title>Live Events</title>
        <meta name="description" content="" />
      </Helmet>
      <View />
    </>
  )
}
