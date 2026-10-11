import React, { useState } from 'react'
import { Helmet } from '@unhead/react/helmet'
import { Link, useParams } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import styled from '@emotion/styled'

import * as routes from '@/routes'
import { mediaQueryForTabletsOrBelow } from '@/media-queries'
import { FullPerformer, ViewNames } from 'shared/modules/performers'
import { FunctionNames, PublicEvent } from 'shared/modules/events'
import { AccessStatus } from 'shared/modules/common'
import { CONTENT_MAX_WIDTH_PX } from '@/config'

import useDataStoreItem from '@/hooks/useDataStoreItem'
import useIsModerator from '@/hooks/useIsModerator'
import useIsLoggedIn from '@/hooks/useIsLoggedIn'
import useDataStoreFunction from '@/hooks/useDataStoreFunction'

import Markdown from '@/components/markdown'
import ErrorMessage from '@/components/error-message'
import LoadingIndicator from '@/components/loading-indicator'
import Heading from '@/components/heading'
import Button from '@/components/button'
import DiscordServerWidget from '@/components/discord-server-widget'
import SocialMediaList from '@/components/social-media-list'
import Avatar from '@/components/avatar'
import Message from '@/components/message'
import SupporterBadgeForm from '@/components/supporter-badge-form'
import Paper from '@/components/paper'
import EventResults from '@/components/event-results'
import NoResultsMessage from '@/components/no-results-message'

const useStyles = makeStyles({
  categories: {
    marginTop: '0',
    marginBottom: '1rem',
    fontSize: '150%',
  },
  icon: {
    '& svg': {
      verticalAlign: 'middle',
      width: 'auto',
      height: '1em',
    },
  },
  cols: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  col: {
    width: 'calc(50% - 0.5rem)',
    margin: '0 0.5rem 0 0',
    '&:last-child': {
      margin: '0 0 0 0.5rem',
    },
    [mediaQueryForTabletsOrBelow]: {
      width: '100%',
    },
  },
  title: {
    textAlign: 'center',
  },
  avatar: {
    display: 'inline-block',
  },
  desc: {
    textAlign: 'center',
  },
})

const Root = styled(Paper)`
  max-width: ${CONTENT_MAX_WIDTH_PX}px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const analyticsCategory = 'ViewPerformer'

const SupporterBadgeButton = ({ performerId }: { performerId: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isExpanded) {
    return (
      <Button onClick={() => setIsExpanded(true)} color="secondary">
        Generate Supporter Badge
      </Button>
    )
  }

  return (
    <SupporterBadgeForm
      route={routes.viewPerformerWithVar.replace(':performerId', performerId)}
    />
  )
}

const EventsForPerformer = ({ performerId }: { performerId: string }) => {
  const [isLoading, lastErrorCode, events] = useDataStoreFunction<
    { performerid: string },
    PublicEvent[]
  >(FunctionNames.GetEventsByPerformer, [], true, {
    performerid: performerId,
  })

  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode as string}>
        Failed to load events for performer
      </ErrorMessage>
    )

  if (isLoading || !events)
    return <LoadingIndicator message="Loading events for performer..." />

  if (!events.length)
    return <NoResultsMessage>No events found</NoResultsMessage>

  return <EventResults events={events} />
}

const View = () => {
  const { performerId } = useParams<{ performerId: string }>()
  const isLoggedIn = useIsLoggedIn()
  const [isLoading, lastErrorCode, performer] = useDataStoreItem<FullPerformer>(
    ViewNames.GetFullPerformers,
    performerId,
    {
      queryName: 'view-performer',
    }
  )
  const classes = useStyles()
  const isMod = useIsModerator()

  if (isLoading) {
    return <LoadingIndicator />
  }

  if (lastErrorCode !== null) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load performer
      </ErrorMessage>
    )
  }

  if (!performer) {
    return <ErrorMessage>The performer does not exist</ErrorMessage>
  }

  const {
    name: name,
    description: description,
    discordserverid: discordServerId,
    thumbnailurl: thumbnailUrl,
    // email: email,
    // websiteurl: websiteUrl,

    // view
    createdbyusername: createdByUsername,
    lastmodifiedbyusername: lastModifiedByUsername,

    // meta
    accessstatus: accessStatus,
    modnotes: modNotes,
    createdby: createdBy,
    lastmodifiedby: lastModifiedBy,
  } = performer

  const isDeleted = accessStatus === AccessStatus.Deleted

  const isPerformerStaff = true // TODO

  return (
    <>
      <Helmet>
        <title>View performer {name}</title>
        <meta
          name="description"
          content={`Browse all of the events that have been submitted for the performer ${name}.`}
        />
      </Helmet>

      <Root>
        {isDeleted !== false && (
          <Message>This performer has been deleted</Message>
        )}
        {modNotes && (
          <Message>
            <strong>Notes from our staff</strong>
            <br />
            <br />
            {modNotes}
          </Message>
        )}

        <div className={classes.title}>
          <div className={classes.avatar}>
            <Avatar
              url={thumbnailUrl || undefined}
              username={name || undefined}
              noHat
              lazy={false}
            />
          </div>
          <Heading variant="h1" center>
            <Link
              to={routes.viewPerformerWithVar.replace(
                ':performerId',
                performerId
              )}>
              {name}
            </Link>
          </Heading>
        </div>

        {description && <Markdown source={description} />}

        <SocialMediaList socials={performer} />

        {discordServerId && (
          <DiscordServerWidget
            serverId={discordServerId}
            joinActionCategory={analyticsCategory}
          />
        )}

        <Heading variant="h2">Events</Heading>
        <EventsForPerformer performerId={performerId} />

        {isMod && (
          <>
            <Heading variant="h2">Moderator Actions</Heading>
            {/* <EditorRecordManager
            id={performerId}
            metaCollectionName={CollectionNames.PerformersMeta}
            editUrl={routes.editPerformerWithVar.replace(':performerId', performerId)}
            showApprovalButtons
            existingApprovalStatus={approvalStatus}
            showPublishButtons
            existingPublishStatus={publishStatus}
            showAccessButtons
            existingAccessStatus={accessStatus}
            showEditorNotes
            existingEditorNotes={modNotes}
            onDone={hydrate}
          /> */}
          </>
        )}

        <Heading variant="h2">Metadata</Heading>
        {createdByUsername && (
          <div>
            Created by{' '}
            <Link to={routes.viewUserWithVar.replace(':userId', createdBy)}>
              {createdByUsername}
            </Link>
          </div>
        )}

        {lastModifiedBy && (
          <div>
            Last modified by{' '}
            <Link
              to={routes.viewUserWithVar.replace(':userId', lastModifiedBy)}>
              {lastModifiedByUsername}
            </Link>
          </div>
        )}
        {/* {isLoggedIn ? (
          <>
            <SupporterBadgeButton performerId={performer.id} />
          </>
        ) : null} */}
      </Root>
    </>
  )
}

export default () => (
  <>
    <Helmet>
      <title>View performer</title>
      <meta name="description" content="View a performer on the site." />
    </Helmet>
    <View />
  </>
)
