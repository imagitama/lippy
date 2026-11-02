import { useRef, useState } from 'react'
import { EventCategory, EventFields } from 'shared/modules/events'
import { importFromJson } from '@/timeline/importer'

import Button from '../button'
import TextInput from '../text-input'
import FormControls from '../form-controls'
import rawDataScreenshotUrl from './images/raw-data-screenshot.png'
import ErrorMessage from '../error-message'
import { ExternalData, ExternalEvent } from '@/timeline/types'
import Paper from '../paper'
import Columns from '@/components/columns'
import Column from '@/components/column'
import Table, {
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/responsive-table'
import ExternalEventOutput from '../external-event-output'
import InfoMessage from '../info-message'
import WarningMessage from '../warning-message'
import FormattedDate from '../formatted-date'
import { timestampToDate } from '@/utils/dates'
import {
  getCategoryForExternalCategory,
  getEventFieldsFromExternalEvent,
} from '@/timeline/map'
import DialogButton from '../dialog-button'
import { PerformanceFields } from 'shared/modules/performances'

enum ErrorCode {
  Unknown = 'unknown',
}

const ImportFromTimelineForm = ({
  clubId,
  clubVrcGroupId,
  onSuccess,
  onCancel,
}: {
  clubId: string
  clubVrcGroupId: string
  onSuccess: (
    fields: Partial<EventFields>,
    posterImageUrl: string | null,
    performances: PerformanceFields[] | null
  ) => void
  onCancel: () => void
}) => {
  const [isProceed, setIsProceed] = useState(false)
  const [textVal, setTextVal] = useState('')
  const [lastErrorCode, setLastErrorCode] = useState<null | ErrorCode>(null)
  const externalDataRef = useRef<null | ExternalData>(null)
  const [externalEvents, setExternalEvents] = useState<null | ExternalEvent[]>(
    null
  )

  const onClickProceed = () => {
    const result = importFromJson(textVal)

    if (!result) {
      setLastErrorCode(ErrorCode.Unknown)
      return
    }

    const { events: allEvents, externalData } = result

    const eventsForGroup = allEvents.filter((ev) =>
      ev.urls.vrcGroup?.includes(clubVrcGroupId)
    )

    console.debug(
      `[Importer] found ${eventsForGroup.length} events for VRC group id '${clubVrcGroupId}'`
    )

    // dont dump in state to avoid unnecessary re-render
    externalDataRef.current = externalData

    setExternalEvents(eventsForGroup || null)
  }

  const onImport = (externalEvent: ExternalEvent) => {
    if (!externalDataRef.current) throw new Error('Need external data')
    const eventFields = getEventFieldsFromExternalEvent(
      externalEvent,
      externalDataRef.current
    )
    onSuccess(eventFields, eventFields.posterurl, eventFields.performances)
  }

  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode as string}>
        Failed to import
      </ErrorMessage>
    )

  if (externalEvents && externalDataRef.current) {
    if (!externalEvents.length)
      return (
        <WarningMessage
          controls={[
            <Button onClick={() => setExternalEvents(null)}>
              Start Again
            </Button>,
            <Button onClick={onCancel} color="secondary">
              Create Manually
            </Button>,
          ]}>
          No events found with VRChat group "{clubVrcGroupId}"
        </WarningMessage>
      )

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
          {externalEvents.map((ev) => (
            <TableRow key={ev.id}>
              <TableCell>{ev.name}</TableCell>
              <TableCell>{ev.description?.slice(0, 50)}...</TableCell>
              <TableCell>
                {getCategoryForExternalCategory(ev.category)}
              </TableCell>
              <TableCell>
                <FormattedDate
                  date={timestampToDate(ev.start)!}
                  isRelative={false}
                />{' '}
                (
                <FormattedDate date={timestampToDate(ev.end)!} isRelative />)
              </TableCell>
              <TableCell>
                <DialogButton
                  dialog={<pre>{JSON.stringify(ev, null, '  ')}</pre>}
                  color="secondary">
                  View JSON
                </DialogButton>{' '}
                <Button
                  onClick={() => onImport(ev)}
                  isDisabled={
                    getCategoryForExternalCategory(ev.category) !==
                    EventCategory.Music
                  }>
                  Import
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <>
      <InfoMessage title="How To Import">
        <p>Timeline's TOS says we cannot automatically get events from it.</p>
        <p>
          Instead you must view all of the raw data that Timeline gives out
          publically and copy it here.
        </p>
      </InfoMessage>
      {!isProceed ? (
        <FormControls>
          <Button onClick={() => setIsProceed(true)}>Proceed</Button>
        </FormControls>
      ) : (
        <>
          <ol>
            <li>
              open{' '}
              <a
                href="https://vrc.tl/api/v1/events"
                target="_blank"
                rel="noopener noreferrer">
                https://vrc.tl/api/v1/events
              </a>{' '}
              in your browser
            </li>
            <li>
              click on "Raw Data" at the very top:
              <br />
              <img
                src={rawDataScreenshotUrl}
                width="100%"
                style={{ maxWidth: '50vw' }}
              />
            </li>
            <li>copy all of the text</li>
            <li>paste it into the textbox below</li>
          </ol>
          <TextInput
            fullWidth
            placeholder="Paste text here"
            multiline
            rows={2}
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
          />
          <FormControls>
            <Button onClick={onClickProceed}>Proceed</Button>
          </FormControls>
        </>
      )}
    </>
  )
}

export default ImportFromTimelineForm
