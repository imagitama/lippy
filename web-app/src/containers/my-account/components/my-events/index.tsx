import React from 'react'

import useDatabaseQuery from '@/hooks/useDatabaseQuery'

import LoadingIndicator from '@/components/loading-indicator'
import ErrorMessage from '@/components/error-message'
import NoResultsMessage from '@/components/no-results-message'
import { ViewNames, FullEvent } from 'shared/modules/events'
import EventResults from '@/components/event-results'
import { routes } from '@/routes'
import Link from '@/components/link'
import FormControls from '@/components/form-controls'
import { CreateButton } from '@/components/button'

export default () => {
  const [isLoading, lastErrorCode, events] = useDatabaseQuery<FullEvent>(
    ViewNames.GetMyEvents,
    [],
    {
      queryName: 'my-events',
    }
  )

  if (isLoading || !events) {
    return <LoadingIndicator message="Loading your events..." />
  }

  if (lastErrorCode) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load your events
      </ErrorMessage>
    )
  }

  if (!events.length) {
    return (
      <>
        <NoResultsMessage>
          You have not created any events (but your{' '}
          <Link
            to={routes.myAccountWithTabNameVar.replace(':tabName', 'clubs')}>
            clubs
          </Link>{' '}
          might have)
        </NoResultsMessage>
        <FormControls>
          <CreateButton url={routes.createEvent} size="large">
            Create Event
          </CreateButton>
        </FormControls>
      </>
    )
  }

  return <EventResults events={events} />
}
