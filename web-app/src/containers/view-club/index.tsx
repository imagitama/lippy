import React, { useState } from 'react'
import { Helmet } from '@unhead/react/helmet'
import { Link, useParams } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import styled from '@emotion/styled'
import EventIcon from '@mui/icons-material/Event'

import * as routes from '@/routes'
import { mediaQueryForTabletsOrBelow } from '@/media-queries'
import { FullClub, ViewNames } from 'shared/modules/clubs'
import {
  ViewNames as EventsViewNames,
  PublicEvent,
} from 'shared/modules/events'
import { AccessStatus } from 'shared/modules/common'

import useDataStoreItem from '@/hooks/useDataStoreItem'
import useIsModerator from '@/hooks/useIsModerator'
import useDatabaseQuery, { Operators } from '@/hooks/useDatabaseQuery'

import Markdown from '@/components/markdown'
import ErrorMessage from '@/components/error-message'
import LoadingIndicator from '@/components/loading-indicator'
import Heading from '@/components/heading'
import Button, { EditButton } from '@/components/button'
import DiscordServerWidget from '@/components/discord-server-widget'
import SocialMediaList from '@/components/social-media-list'
import Avatar from '@/components/avatar'
import Message from '@/components/message'
import SupporterBadgeForm from '@/components/supporter-badge-form'
import { CONTENT_MAX_WIDTH_PX } from '@/config'
import Paper from '@/components/paper'
import useUserId from '@/hooks/useUserId'
import FormControls from '@/components/form-controls'
import SyncVrchatGroupForm from '@/components/sync-vrchat-group-form'
import EventResults from '@/components/event-results'
import NoResultsMessage from '@/components/no-results-message'
import Metadata from '@/components/metadata'

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

const analyticsCategory = 'ViewClub'

const SupporterBadgeButton = ({ clubId }: { clubId: string }) => {
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
      route={routes.viewClubWithVar.replace(':clubId', clubId)}
    />
  )
}

const EventsForClub = ({ clubId }: { clubId: string }) => {
  const [isLoading, lastErrorCode, events] = useDatabaseQuery<PublicEvent>(
    EventsViewNames.GetPublicEvents,
    [['clubid', Operators.EQUALS, clubId]]
  )

  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load event for club
      </ErrorMessage>
    )

  if (isLoading || !events)
    return <LoadingIndicator message="Loading events for club..." />

  if (!events.length)
    return <NoResultsMessage>No events found for club</NoResultsMessage>

  return <EventResults events={events} />
}

const Root = styled.div`
  max-width: ${CONTENT_MAX_WIDTH_PX}px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const View = () => {
  const { clubId } = useParams<{ clubId: string }>()
  const myUserId = useUserId()
  const [isLoading, lastErrorCode, club] = useDataStoreItem<FullClub>(
    ViewNames.GetFullClubs,
    clubId,
    {
      queryName: 'view-club',
    }
  )
  const classes = useStyles()
  const isMod = useIsModerator()

  if (isLoading) {
    return <LoadingIndicator />
  }

  if (lastErrorCode !== null) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>Failed to load club</ErrorMessage>
    )
  }

  if (!club) {
    return <ErrorMessage>The club does not exist</ErrorMessage>
  }

  const {
    name: name,
    description: description,
    discordserverid: discordServerId,
    thumbnailurl: thumbnailUrl,
    email: email,
    websiteurl: websiteUrl,

    // view
    createdbyusername: createdByUsername,
    lastmodifiedbyusername: lastModifiedByUsername,

    // meta
    accessstatus: accessStatus,
    modnotes: modNotes,
    createdby: createdBy,
    lastmodifiedby: lastModifiedBy,
  } = club

  const isDeleted = accessStatus === AccessStatus.Deleted

  const isClubOwner = myUserId
    ? club.owneruserids.includes(myUserId) || club.createdby === myUserId
    : false
  const isClubMod = myUserId ? club.moduserids.includes(myUserId) : false
  const isClubStaff = isClubOwner || isClubMod

  return (
    <Root>
      <Helmet>
        <title>View club {name}</title>
        <meta
          name="description"
          content={`Browse all of the events that have been submitted for the club ${name}.`}
        />
      </Helmet>

      {isDeleted !== false && (
        <ErrorMessage>This club has been deleted</ErrorMessage>
      )}

      {modNotes && <Message title="Moderator Notes">{modNotes}</Message>}

      {isClubOwner && (
        <Message>
          You are a club owner so you can edit the club.
          <FormControls>
            {/* <SyncVrchatGroupForm vrchatGroupId={club.linkedvrchatgroupid} /> */}
            <EditButton
              url={routes.editClubWithVar.replace(':clubId', club.id)}
              color="secondary">
              Edit Club
            </EditButton>
          </FormControls>
        </Message>
      )}

      {isClubStaff && (
        <Message>
          You are a staff member for this club so you can create events for it.
          <FormControls>
            <Button
              icon={<EventIcon />}
              url={routes.createEventWithClubVar.replace(':clubId', club.id)}
              color="secondary">
              Create Club Event
            </Button>
          </FormControls>
        </Message>
      )}

      <Paper>
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
            <Link to={routes.viewClubWithVar.replace(':clubId', clubId)}>
              {name}
            </Link>
          </Heading>
        </div>

        {description && <Markdown source={description} />}

        <SocialMediaList socials={club} />

        {discordServerId && (
          <DiscordServerWidget
            serverId={discordServerId}
            joinActionCategory={analyticsCategory}
          />
        )}

        <Heading variant="h2">Events</Heading>
        <EventsForClub clubId={clubId} />

        {isMod && (
          <div>
            <Heading variant="h2">Moderator Actions</Heading>
            <FormControls>
              <EditButton
                url={routes.editClubWithVar.replace(':clubId', club.id)}>
                Edit Club
              </EditButton>
              <SyncVrchatGroupForm vrchatGroupId={club.linkedvrchatgroupid} />
            </FormControls>
            {/* <EditorRecordManager
            id={clubId}
            metaCollectionName={CollectionNames.ClubsMeta}
            editUrl={routes.editClubWithVar.replace(':clubId', clubId)}
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
          </div>
        )}

        <Heading variant="h2">Metadata</Heading>
        <Metadata item={club} />
      </Paper>
    </Root>
  )
}

export default () => (
  <>
    <Helmet>
      <title>View club</title>
      <meta name="description" content="View a club on the site." />
    </Helmet>
    <View />
  </>
)
