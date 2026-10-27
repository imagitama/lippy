import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import { EventFields } from 'shared/modules/events'
import {
  VrchatGroupEvent,
  VrchatGroupEventCategory,
} from 'shared/vrchat/events'
import ErrorMessage from '../error-message'
import LoadingIndicator from '../loading-indicator'
import Button from '../button'
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../responsive-table'
import { getEventFromVrchatGroupEvent } from './map'
import useDataStoreItem from '@/hooks/useDataStoreItem'
import { Club, CollectionNames } from 'shared/modules/clubs'
import FormControls from '../form-controls'
import FormattedDate from '../formatted-date'

enum SupabaseFunctionNames {
  GetVrchatGroupEvents = 'getVrchatGroupEvents',
}

interface GetVrchatGroupEventsPayload {
  vrchatGroupId: string
}
interface GetVrchatGroupEventsResult {
  success: boolean
  events?: VrchatGroupEvent[]
  error?: string
}

const ImportVrchatEventForm = ({
  clubId,
  onSuccess,
  onCancel,
}: {
  clubId: string
  onSuccess: (
    fields: Partial<EventFields>,
    posterImageUrl: string | null
  ) => void
  onCancel: () => void
}) => {
  const [isCalling, lastErrorCodeGetting, lastGetResult, performGet] =
    useSupabaseFunction<
      GetVrchatGroupEventsPayload,
      GetVrchatGroupEventsResult
    >(SupabaseFunctionNames.GetVrchatGroupEvents)
  const [isLoadingClub, lastErrorCodeClub, club] = useDataStoreItem<Club>(
    CollectionNames.Clubs,
    clubId
  )

  const onFetch = () => {
    if (!club || !club?.vrchatgroupid) return

    performGet({
      vrchatGroupId: club.vrchatgroupid!,
    })
  }

  if (!clubId) return <ErrorMessage>No club ID</ErrorMessage>

  if (isLoadingClub) return <LoadingIndicator message="Loading club..." />

  if (lastErrorCodeClub !== null || !club)
    return (
      <ErrorMessage errorCode={lastErrorCodeClub ?? undefined}>
        Failed to load club
      </ErrorMessage>
    )

  if (!club.vrchatgroupid)
    return (
      <ErrorMessage>
        Club does not have a VRChat group associated with it
      </ErrorMessage>
    )

  if (isCalling)
    return <LoadingIndicator message="Fetching VRChat group events..." />

  if (lastErrorCodeGetting !== null)
    return (
      <ErrorMessage errorCode={lastErrorCodeGetting}>
        Failed to load VRChat group events
      </ErrorMessage>
    )

  if (!lastGetResult)
    return (
      <FormControls>
        <Button onClick={onFetch}>Fetch Events</Button>
        <Button color="secondary" onClick={onCancel}>
          Create Manually
        </Button>
      </FormControls>
    )

  if (!lastGetResult?.success)
    return (
      <ErrorMessage>
        Failed to load VRChat group events:{' '}
        {lastGetResult?.error || '(no error)'}
      </ErrorMessage>
    )

  if (!lastGetResult.events || !lastGetResult.events.length)
    return (
      <ErrorMessage
        controls={[
          <Button onClick={onCancel}>Create Manually</Button>,
          <Button color="secondary" onClick={onFetch}>
            Try Again
          </Button>,
        ]}>
        No events found
      </ErrorMessage>
    )

  const onImport = (vrchatGroupEvent: VrchatGroupEvent) => {
    const result = getEventFromVrchatGroupEvent(vrchatGroupEvent)

    if (!result) {
      throw new Error('Failed to import event')
    }

    onSuccess(result.event, result.posterImageUrl)
  }

  return (
    <Table size="small" noMinWidth>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Starts At</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {lastGetResult.events.map((ev) => (
          <TableRow key={ev.id}>
            <TableCell>{ev.title}</TableCell>
            <TableCell>{ev.description.slice(0, 50)}...</TableCell>
            <TableCell>
              {ev.category}{' '}
              {ev.category !== VrchatGroupEventCategory.Music
                ? '(cannot be imported)'
                : ''}
            </TableCell>
            <TableCell>
              <FormattedDate date={ev.startsAt} isRelative={false} /> (
              <FormattedDate date={ev.startsAt} isRelative />)
            </TableCell>
            <TableCell>
              <Button
                onClick={() => onImport(ev)}
                isDisabled={ev.category !== VrchatGroupEventCategory.Music}>
                Import
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ImportVrchatEventForm
