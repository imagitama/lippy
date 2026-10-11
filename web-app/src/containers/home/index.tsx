import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Helmet } from '@unhead/react/helmet'

import useDatabaseQuery, { Operators } from '@/hooks/useDatabaseQuery'
import { PublicEvent, ViewNames } from 'shared/modules/events'
import HorizontalTimeline, { TimeRange } from '@/components/horizontal-timeline'
import EventPanel from '@/components/event-panel'
import ErrorBoundary from '@/components/error-boundary'
import ErrorMessage from '@/components/error-message'

const StyledRoot = styled.div`
  position: relative;
  height: 100%;
`

const View = () => {
  const [selectedEventId, setSelectedEventId] = useState<null | string>(null)
  const [range, setRange] = useState<TimeRange>(() => {
    const now = Date.now()
    return {
      start: new Date(now - 60 * 60 * 1000), // 1 hour ago
      end: new Date(now + 60 * 60 * 1000), // 1 hour from now
    }
  })
  const [isLoading, lastErrorCode, events, hydrate] =
    useDatabaseQuery<PublicEvent>(ViewNames.GetPublicEvents, [
      ['startsat', Operators.LESS_THAN, range.end.toISOString()],
      ['endsat', Operators.GREATER_THAN, range.start.toISOString()],
    ])

  const selectedEvent =
    (selectedEventId && events?.find((ev) => ev.id === selectedEventId)) || null

  console.debug(`view.render`, { range, events })

  return (
    <StyledRoot>
      {lastErrorCode !== null && (
        <ErrorMessage errorCode={lastErrorCode}>
          Failed to load events
        </ErrorMessage>
      )}
      <HorizontalTimeline
        events={events || []}
        onEventClick={(ev) => {
          console.debug(`onEventClick`, ev)
          setSelectedEventId(ev.id)
        }}
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
