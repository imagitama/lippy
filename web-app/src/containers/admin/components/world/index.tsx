import CheckIcon from '@mui/icons-material/Check'
import styled from '@emotion/styled'

import BodyText from '@/components/body-text'
import Button from '@/components/button'
import Column from '@/components/column'
import Columns from '@/components/columns'
import DialogButton from '@/components/dialog-button'
import ErrorMessage from '@/components/error-message'
import FormControls from '@/components/form-controls'
import FormattedDate from '@/components/formatted-date'
import Heading from '@/components/heading'
import LoadingIndicator from '@/components/loading-indicator'
import NoResultsMessage from '@/components/no-results-message'
import NoValueLabel from '@/components/no-value-label'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/responsive-table'
import ShortId from '@/components/short-id'
import WarningMessage from '@/components/warning-message'
import useDataStoreItems from '@/hooks/useDataStoreItems'
import useIsModerator from '@/hooks/useIsModerator'
import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import { routes } from '@/routes'
import {
  CollectionNames,
  EventAlphaOrBeta,
  FullEventAlphaOrBeta,
  GetWorldDataRecord,
  ViewNames,
  WorldDataEvent,
} from 'shared/modules/world'
import { Fragment, useState } from 'react'

const ATLAS_IMAGE_PATTERN = `${process.env.REACT_APP_SUPABASE_STORAGE_URL}/storage/v1/object/public/atlasses/atlas_$0_$1.png`

const AtlasImage = styled.img`
  outline: 1px dashed #fff;
`

const AlphaOrBetaTable = ({ isAlpha }: { isAlpha: boolean }) => {
  const [isLoading, lastErrorCode, results, , hydrate] =
    useDataStoreItems<FullEventAlphaOrBeta>(
      isAlpha ? ViewNames.GetFullAlphaEvents : ViewNames.GetFullBetaEvents
    )
  const [expandedId, setExpandedId] = useState<null | string>(null)

  if (isLoading) return <LoadingIndicator message="Loading world data..." />

  if (lastErrorCode)
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load records
      </ErrorMessage>
    )

  if (!results?.length) return <NoResultsMessage>No events</NoResultsMessage>

  if (!results) return <ErrorMessage>Data is empty</ErrorMessage>

  return (
    <Table size="small" noMinWidth>
      <TableHead>
        <TableCell></TableCell>
        <TableCell>Atlas Info</TableCell>
        <TableCell>Added At</TableCell>
      </TableHead>
      <TableBody>
        {results.map((result) => (
          <Fragment key={result.eventid}>
            <TableRow>
              <TableCell>
                <ShortId
                  url={routes.viewEventWithVar.replace(
                    ':eventId',
                    result.eventid
                  )}>
                  {result.eventid}
                </ShortId>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() =>
                    setExpandedId(
                      result.eventid === expandedId ? null : result.eventid
                    )
                  }>
                  Show Event
                </Button>
              </TableCell>
              <TableCell>
                {result.atlas ? (
                  <>
                    #{result.atlas.idx}
                    <br />
                    {result.atlas.x},{result.atlas.y}
                  </>
                ) : (
                  <NoValueLabel>(not in atlas)</NoValueLabel>
                )}
              </TableCell>
              <TableCell>
                <FormattedDate date={result.addedat} isRelative={false} />
                <br />(
                <FormattedDate date={result.addedat} isRelative />)
              </TableCell>
            </TableRow>
            {expandedId === result.eventid && (
              <TableRow>
                <TableCell colSpan={3}>
                  {JSON.stringify(result.event)}
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  )
}

const AlphaTable = () => <AlphaOrBetaTable isAlpha />
const BetaTable = () => <AlphaOrBetaTable isAlpha={false} />

const WorldDataOutput = () => {
  const [isLoading, lastErrorCode, results, , hydrate] =
    useDataStoreItems<GetWorldDataRecord>(CollectionNames.WorldData)

  const isAdmin = useIsModerator()

  if (isLoading) return <LoadingIndicator message="Loading world data..." />

  if (lastErrorCode)
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load world data
      </ErrorMessage>
    )

  // if (!results || results.length === 0)
  //   return <ErrorMessage>Data is empty/wrong</ErrorMessage>

  const worldData = results?.length ? results[0] : null
  const events = worldData
    ? (JSON.parse(worldData.events) as WorldDataEvent[])
    : []
  const isAlpha = worldData?.isalpha || false

  return (
    <>
      {isAdmin && (
        <FormControls>
          <ManualRegenerateButton hydrate={hydrate} />
          <br />
          <br />
          <Button onClick={hydrate} color="secondary">
            Refresh
          </Button>
        </FormControls>
      )}
      <Heading variant="h2">Overview</Heading>
      {worldData ? (
        <dl>
          <dt>Fetched At</dt>
          <dd>
            <FormattedDate date={new Date()} isRelative={false} />
          </dd>
          <dt>Version</dt>
          <dd>{worldData.isalpha ? 'Alpha' : 'Beta'}</dd>
          <dt>Atlas Count</dt>
          <dd>{worldData.atlascount}</dd>
          <dt>Generated</dt>
          <dd>
            <FormattedDate date={worldData.generatedat} isRelative={false} /> (
            <FormattedDate date={worldData.generatedat} isRelative />)
          </dd>
          <dt>Modified</dt>
          <dd>
            {worldData.lastmodifiedat ? (
              <>
                <FormattedDate
                  date={worldData.lastmodifiedat}
                  isRelative={false}
                />{' '}
                (
                <FormattedDate date={worldData.lastmodifiedat} isRelative />)
              </>
            ) : (
              '-'
            )}
          </dd>
        </dl>
      ) : (
        <NoResultsMessage>No world data yet</NoResultsMessage>
      )}
      <Heading variant="h2">Events</Heading>
      <Table size="small">
        <TableHead>
          <TableCell>#</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Start</TableCell>
          <TableCell>End</TableCell>
          <TableCell>Group ID</TableCell>
          {/* <TableCell>Instance ID</TableCell> */}
          <TableCell>Atlas</TableCell>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <Fragment key={event.id}>
              <TableRow>
                <TableCell>
                  <ShortId
                    url={routes.viewEventWithVar.replace(':eventId', event.id)}>
                    {event.id}
                  </ShortId>
                </TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.startsat}</TableCell>
                <TableCell>{event.endsat}</TableCell>
                <TableCell>{event.vrchatgroupid}</TableCell>
                <TableCell>
                  {event.atlas ? (
                    <>
                      #{event.atlas.idx}
                      <br />
                      {event.atlas.x},{event.atlas.y}
                    </>
                  ) : (
                    <NoValueLabel>(not in atlas)</NoValueLabel>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6}>
                  <pre>{JSON.stringify(event, null, '  ')}</pre>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
      <Heading variant="h2">Atlasses</Heading>
      {worldData ? (
        worldData.atlascount > 0 ? (
          Array.from({ length: worldData.atlascount }).map((_, i) => {
            const url = ATLAS_IMAGE_PATTERN.replace(
              '$0',
              worldData.isalpha ? 'alpha' : 'beta'
            ).replace('$1', i.toString())
            return (
              <div>
                <Heading variant="h3">
                  {worldData.isalpha ? 'Alpha' : 'Beta'} #{i}
                </Heading>
                URL:{' '}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download image">
                  {url}
                </a>
                <br />
                <AtlasImage
                  width="100%"
                  src={`${url}?time=${Date.now()}`}
                  alt="Atlas image"
                />
              </div>
            )
          })
        ) : (
          <NoResultsMessage>No atlas images generated</NoResultsMessage>
        )
      ) : (
        <NoResultsMessage>No world data yet</NoResultsMessage>
      )}
      <Heading variant="h2">Alpha & Beta</Heading>
      <Columns>
        <Column>
          <Heading variant="h3">Alpha {isAlpha && <CheckIcon />}</Heading>
          <AlphaTable />
        </Column>
        <Column>
          <Heading variant="h3">Beta {!isAlpha && <CheckIcon />}</Heading>
          <BetaTable />
        </Column>
      </Columns>
    </>
  )
}

enum FunctionNames {
  GenerateAtlasses = 'generateAtlasses',
}

interface GenerateAtlassesPayload {}
interface GenerateAtlassesResult {
  success: boolean
}

const ManualRegenerateButton = ({ hydrate }: { hydrate: () => void }) => {
  const [isGenerating, lastErrorCode, lastResult, generateAtlasses] =
    useSupabaseFunction<GenerateAtlassesPayload, GenerateAtlassesResult>(
      FunctionNames.GenerateAtlasses
    )

  const onClickConfirm = async () => {
    const result = await generateAtlasses({})
    if (result?.success) hydrate()
  }

  if (isGenerating) return <LoadingIndicator message="Generating atlasses..." />

  if (lastErrorCode)
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to call function
      </ErrorMessage>
    )

  return (
    <>
      {lastResult !== null ? JSON.stringify(lastResult) : null}
      <DialogButton
        dialog={
          <>
            <WarningMessage>
              Are you sure you want to do this?
              <FormControls>
                <Button onClick={onClickConfirm}>Yes!</Button>
              </FormControls>
            </WarningMessage>
          </>
        }>
        Manually Regenerate World Data
      </DialogButton>
    </>
  )
}

const World = () => {
  return (
    <>
      <Heading variant="h1">World</Heading>
      <WorldDataOutput />
    </>
  )
}

export default World
