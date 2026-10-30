import { useCallback, useEffect, useState } from 'react'

import BodyText from '@/components/body-text'
import ErrorMessage from '@/components/error-message'
import Heading from '@/components/heading'
import Message from '@/components/message'
import NoResultsMessage from '@/components/no-results-message'
import TextInput from '@/components/text-input'
import WarningMessage from '@/components/warning-message'
import { Helmet } from '@unhead/react/helmet'
import Paper from '@/components/paper'
import { ExternalData, ExternalEvent, ExternalEventSlot } from './types'
import Table, {
  TableBody,
  TableCell,
  TableRow,
} from '@/components/responsive-table'
import Button from '@/components/button'
// import testDataJson from './test-data.json?raw'
import useDataStoreItems from '@/hooks/useDataStoreItems'
import {
  CollectionNames,
  FunctionNames,
  ImporterDetails,
  ImportExternalEventPayload,
  ImportExternalEventResult,
} from './data-store'
import useDataStore, { GetQueryFn } from '@/hooks/useDataStore'
import LoadingIndicator from '@/components/loading-indicator'
import Columns from '@/components/columns'
import Column from '@/components/column'
import useDataStoreCreate from '@/hooks/useDataStoreCreate'
import useDataStoreFunction from '@/hooks/useDataStoreFunction'
import SuccessMessage from '@/components/success-message'
import { EventFieldsResult, getEventFieldsFromExternalEvent } from './map'
import ImageUploadInput from '@/components/generic-editor/components/image-upload-input'
import editableFields from '@/editable-fields/events'
import { ImageUploadEditableField } from '@/editable-fields'
import { Event } from 'shared/modules/events'
import ImageUploader from '@/components/image-uploader'
import LazyLoad from '@/components/lazy-load'
import FormattedDate from '@/components/formatted-date'
import CheckboxInput from '@/components/checkbox-input'
import DateTimeRangeInput from '@/components/datetime-range-input'
import { callFunction, client } from '@/supabase'
import { getVrchatGroupIdFromUrl } from '@/vrchat'
import FormControls from '@/components/form-controls'
import InfoMessage from '@/components/info-message'
import Link from '@/components/link'
import { routes } from '@/routes'
import { downloadExternalImageToUrl } from '@/hooks/useDownloadExternalImage'

const ComponentForField = ({
  name,
  val,
  all,
}: {
  name: keyof ExternalEvent
  val: any
  all: ExternalEvent
}) => {
  switch (name) {
    // case 'name': return <span>{val}</span>
    // case 'description': return <span>{val}</span>

    case 'start':
    case 'end':
      return (
        <span>
          {val}
          <br />
          Mapped:{' '}
          <FormattedDate date={new Date(val * 1000)} isRelative={false} /> (
          <FormattedDate date={new Date(val * 1000)} isRelative />)
        </span>
      )

    case 'duration':
      const secs = val
      return (
        <span>
          {secs} ({secs / 60} mins)
        </span>
      )

    case 'eventSlots':
      return (
        <Table size="small" noMinWidth>
          <TableBody>
            {(val as ExternalEventSlot[]).map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>
                  <Table size="small" noMinWidth>
                    <TableBody>
                      <TableRow>
                        <TableCell>Datetime</TableCell>
                        <TableCell>
                          {slot.start} ({slot.duration / 60} mins)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Performers</TableCell>
                        <TableCell>
                          {slot.performers.length > 0 ? (
                            <Table size="small" noMinWidth>
                              <TableBody>
                                {slot.performers.map((perf) => (
                                  <TableRow key={perf.id}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>{perf.performerId}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            '(none)'
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Flag</TableCell>
                        <TableCell>{slot.flag}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Notes</TableCell>
                        <TableCell>{slot.note || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )

    default:
      return <span>{JSON.stringify(val)}</span>
  }
}

const getVrchatGroupId = (ev: ExternalEvent): string | null => {
  if (!ev.urls.vrcGroup) return null
  return getVrchatGroupIdFromUrl(ev.urls.vrcGroup)
}

const SingleExternalEventImporter = ({
  externalEvent,
  ourEventFields,
}: {
  externalEvent: ExternalEvent
  ourEventFields: EventFieldsResult
}) => {
  const [isCalling, lastErrorCode, lastResult, performImport] =
    useDataStoreFunction<ImportExternalEventPayload, ImportExternalEventResult>(
      FunctionNames.ImportExternalEvent,
      []
    )
  const [posterUrl, setPosterUrl] = useState<null | string>(null)
  const [posterUrlToUse, setPosterUrlToUse] = useState<null | string>(null)
  const [genresVal, setGenresVal] = useState<string>('')

  const onClickImport = () => {
    const genres =
      genresVal
        ?.split('\n')
        .map((line) => line.trim())
        .filter((line) => line) || []
    performImport({
      p_ev: {
        ...ourEventFields,
        posterurl: posterUrl,
        genres,
      },
      p_externalid: externalEvent.id,
      p_vrchatgroupid: getVrchatGroupId(externalEvent),
      p_clubname: ourEventFields.clubname,
    })
  }

  //   const isImportAllowed = !isCalling && posterUrl !== null
  const isImportAllowed = !isCalling

  const posterEditableField = editableFields.find(
    (field) => field.name === 'posterurl'
  ) as ImageUploadEditableField<Event>
  if (!posterEditableField) throw new Error('No editable field')

  const onClickDownload = async () => {
    console.debug(`downloading event poster...`)
    const url = await downloadExternalImageToUrl(externalEvent.poster!)
    console.debug(`we have an internal URL: `, url)
    setPosterUrlToUse(url)
  }

  return (
    <>
      <TextInput
        value={genresVal}
        onChange={(e) => setGenresVal(e.target.value)}
        multiline
        rows={3}
        placeholder="Genres (1 per line)"
      />
      {externalEvent.poster ? (
        <>
          <a href={externalEvent.poster} target="_blank" download="my_file.jpg">
            Open Image In New Tab
          </a>
          <hr />
          {posterUrl ? (
            <img src={posterUrl} width="300px" alt="Poster image" />
          ) : (
            <>
              <Button onClick={onClickDownload} color="secondary">
                Download Poster ({externalEvent.poster})
              </Button>
              {posterUrlToUse ? (
                <ImageUploader
                  preloadImageUrl={posterUrlToUse}
                  onDone={(urls) => {
                    console.debug(`GenericEditor.ImageUploadInput urls`, {
                      urls,
                    })
                    setPosterUrl(urls[0])
                  }}
                  {...posterEditableField}
                />
              ) : (
                <InfoMessage>Waiting to download poster</InfoMessage>
              )}
            </>
          )}
        </>
      ) : (
        <NoResultsMessage>
          The external event does not have a poster
        </NoResultsMessage>
      )}
      {isCalling ? (
        <LoadingIndicator />
      ) : lastErrorCode !== null ? (
        <ErrorMessage>Failed to import: {lastErrorCode}</ErrorMessage>
      ) : lastResult ? (
        <SuccessMessage>
          Event created:{' '}
          <a
            href={routes.viewEventWithVar.replace(
              ':eventId',
              lastResult.eventid
            )}
            target="_blank">
            View Event (new tab)
          </a>
        </SuccessMessage>
      ) : null}
      <FormControls>
        <Button
          onClick={onClickImport}
          isDisabled={!isImportAllowed}
          size="large">
          Create Event
        </Button>
      </FormControls>
    </>
  )
}

const OurFields = ({
  ourEventFields,
}: {
  ourEventFields: EventFieldsResult
}) => {
  return (
    <Table size="small" noMinWidth>
      <TableBody>
        {Object.entries(ourEventFields).map(([fieldName, val]) => (
          <TableRow key={fieldName}>
            <TableCell>{fieldName}</TableCell>
            <TableCell>{JSON.stringify(val)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const ExternalEventOutput = ({
  externalEvent,
  existingImporterDetails,
  fullData,
}: {
  externalEvent: ExternalEvent
  existingImporterDetails: ImporterDetails | null
  fullData: ExternalData
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const ourEventFields = getEventFieldsFromExternalEvent(
    externalEvent,
    fullData
  )

  if (existingImporterDetails) {
    return (
      <Paper>
        Event "{externalEvent.name}" already imported as event '
        {existingImporterDetails.eventid}'
      </Paper>
    )
  }

  if (externalEvent.category !== 1)
    return <Paper> Event "{externalEvent.name}" is not music category</Paper>

  return (
    <Paper>
      <Button onClick={() => setIsExpanded(!isExpanded)} color="secondary">
        Toggle Expand
      </Button>
      {isExpanded ? (
        <Columns>
          <Column widthPerc={50}>
            <Table size="small" noMinWidth>
              <TableBody>
                {Object.entries(externalEvent).map(([name, val]) => (
                  <TableRow key={name}>
                    <TableCell width="20%">{name}</TableCell>
                    <TableCell width="80%">
                      <ComponentForField
                        name={name as keyof ExternalEvent}
                        val={val}
                        all={externalEvent}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Column>
          <Column widthPerc={50}>
            <OurFields ourEventFields={ourEventFields} />
          </Column>
        </Columns>
      ) : (
        <Paper>
          <strong>
            {externalEvent.name} ({externalEvent.category})
          </strong>
        </Paper>
      )}
      <>
        <Heading variant="h2" noTopMargin>
          Import
        </Heading>
        {existingImporterDetails ? (
          <NoResultsMessage>
            Cannot import - event already exists
          </NoResultsMessage>
        ) : (
          <SingleExternalEventImporter
            externalEvent={externalEvent}
            ourEventFields={ourEventFields}
          />
        )}
      </>
    </Paper>
  )
}

export const getExternalEventsFromData = (obj: ExternalData): ExternalEvent[] =>
  obj?.eventData?.events ?? []

const EventsOutput = ({ json }: { json: string }) => {
  let externalData: null | ExternalData = null
  let rawEvents: null | ExternalEvent[] = null

  try {
    externalData = JSON.parse(json)
    rawEvents = getExternalEventsFromData(externalData!)
  } catch (err) {
    // ignore
  }

  const ids: number[] | false = rawEvents ? rawEvents.map((ev) => ev.id) : false

  const getQuery = useCallback<GetQueryFn<ImporterDetails>>(
    (client) =>
      ids
        ? client
            .from(CollectionNames.ImporterDetails)
            .select<string, ImporterDetails>('*')
            .in('externalid', ids)
        : null,
    [ids ? ids.join(',') : 'false']
  )

  const [isLoading, lastErrorCode, existingImporterDetails] =
    useDataStore<ImporterDetails>(getQuery)

  const [isFiltering, setIsFiltering] = useState(false)
  const [filterDates, setFilterDates] = useState<null | {
    startsAt: string | undefined
    endsAt: string | undefined
  }>(null)

  if (isLoading)
    return <LoadingIndicator message="Finding existing imports..." />
  if (lastErrorCode !== null)
    return <ErrorMessage errorCode={lastErrorCode}>Failed to find</ErrorMessage>

  if (!json) return <NoResultsMessage>No JSON yet</NoResultsMessage>

  if (!externalData || !rawEvents || !rawEvents.length)
    return <NoResultsMessage>No events found</NoResultsMessage>

  const sorted = rawEvents.toSorted((a, b) => a.end - b.end)

  const toUnix = (s?: string) => {
    if (!s) return undefined
    const ms = new Date(s).getTime()
    return Number.isNaN(ms) ? undefined : Math.floor(ms / 1000)
  }

  const from = isFiltering ? toUnix(filterDates?.startsAt) : undefined
  const to = isFiltering ? toUnix(filterDates?.endsAt) : undefined

  const results = sorted.filter(
    (e) =>
      (from === undefined || e.end >= from) && (to === undefined || e.end <= to)
  )

  return (
    <>
      <Paper title="Events">
        Found {rawEvents.length} events
        <hr />
        <CheckboxInput
          value={isFiltering}
          label={'Filter by date'}
          onChange={(newVal) => setIsFiltering(newVal)}
        />
        {isFiltering && (
          <>
            <DateTimeRangeInput
              startsAtValue={filterDates?.startsAt || new Date().toISOString()}
              endsAtValue={filterDates?.endsAt || new Date().toISOString()}
              onChange={(newStartsAt, newEndsAt) =>
                setFilterDates({
                  startsAt: newStartsAt,
                  endsAt: newEndsAt,
                })
              }
            />
            Filtering to {results.length}
          </>
        )}
      </Paper>
      {results.map((rawEvent) => (
        <LazyLoad key={rawEvent.id}>
          <ExternalEventOutput
            externalEvent={rawEvent}
            existingImporterDetails={
              existingImporterDetails?.find(
                (item) => item.externalid === rawEvent.id
              ) || null
            }
            fullData={externalData}
          />
        </LazyLoad>
      ))}
    </>
  )
}

const Importer = () => {
  const [textVal, setTextVal] = useState<string>(
    // testDataJson as unknown as string
    ''
  )
  return (
    <>
      <Helmet>
        <title>Importer</title>
        <meta name="description" content="Import events from other sites." />
      </Helmet>
      <Heading variant="h1">Importer</Heading>
      <BodyText>Import events from other websites.</BodyText>
      <Message title="How to use">
        <ol>
          <li>
            Get the JSON:
            <ol>
              <li>open your browser DevTools</li>
              <li>go to Network tab</li>
              <li>find the request that returns event JSON</li>
            </ol>
          </li>
          <li>Paste the JSON into the textbox below</li>
          <li>Any events that can be imported will be shown to you</li>
          <li>Below each event is a form to import the event</li>
        </ol>
      </Message>
      <TextInput
        label="JSON"
        value={textVal}
        onChange={(e) => setTextVal(e.target.value)}
        multiline
        rows={2}
        placeholder="JSON"
        fullWidth
      />
      <EventsOutput json={textVal} />
    </>
  )
}

export default Importer
