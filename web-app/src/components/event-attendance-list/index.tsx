import useDatabaseQuery, { Operators } from '@/hooks/useDatabaseQuery'
import { FullEventAttendance, ViewNames } from 'shared/modules/events'
import LoadingIndicator from '../loading-indicator'
import ErrorMessage from '../error-message'
import EventAttendanceResults from '../event-attendance-results'
import EventAttendanceButton from '../event-attendance-button'
import NoResultsMessage from '../no-results-message'

const EventAttendanceList = ({
  eventId,
  showButton,
}: {
  eventId: string
  showButton: boolean
}) => {
  const [isLoading, lastErrorCode, results, hydrate] =
    useDatabaseQuery<FullEventAttendance>(ViewNames.GetFullEventAttendance, [
      ['eventid', Operators.EQUALS, eventId],
    ])

  if (isLoading) return <LoadingIndicator message="Loading attendees..." />

  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load attendees
      </ErrorMessage>
    )

  return (
    <>
      {showButton && (
        <EventAttendanceButton eventId={eventId} onDone={hydrate} />
      )}
      {!results || !results.length ? (
        <NoResultsMessage>No attendees for this event</NoResultsMessage>
      ) : (
        <EventAttendanceResults items={results} />
      )}
    </>
  )
}

export default EventAttendanceList
