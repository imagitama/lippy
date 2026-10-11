import React, { useCallback } from 'react'
import { Helmet } from '@unhead/react/helmet'
import LaunchIcon from '@mui/icons-material/Launch'
import { makeStyles } from '@mui/styles'
import EditIcon from '@mui/icons-material/Edit'
import { useParams } from 'react-router'

import * as routes from '@/routes'
import {
  AttendanceStatus,
  CollectionNames,
  FullEvent,
  ViewNames,
} from 'shared/modules/events'
import { mediaQueryForMobiles } from '@/media-queries'

import useDataStore, { GetQueryFn } from '@/hooks/useDataStore'
import useUserId from '@/hooks/useUserId'
import useIsModerator from '@/hooks/useIsModerator'

import LoadingIndicator from '@/components/loading-indicator'
import NoResultsMessage from '@/components/no-results-message'
import EditorRecordManager from '@/components/editor-record-manager'
import PublicEditorNotes from '@/components/public-editor-notes'
import CommentList from '@/components/comment-list'
import Block from '@/components/block'
import EventAttendanceButton from '@/components/event-attendance-button'
import EventAttendanceResults from '@/components/event-attendance-results'
import Link from '@/components/link'
import ErrorMessage from '@/components/error-message'
import Heading from '@/components/heading'
import Markdown from '@/components/markdown'
import Button from '@/components/button'
import EventDateRange from '@/components/event-date-range'
import PerformanceList from '@/components/performance-list'
import TagList from '@/components/tag-list'
import HydrateVrchatInstanceButton from './components/hydrate-vrchat-instance-button'
import VisitVrchatInstanceButton from '@/components/visit-vrchat-instance-button'
import Paper from '@/components/paper'
import FormControls from '@/components/form-controls'
import ClubStaffControls from '@/components/club-staff-controls'

const useStyles = makeStyles({
  root: { position: 'relative' },
  cols: {
    maxWidth: '100vw',
    display: 'flex',
    flexDirection: 'row',
    [mediaQueryForMobiles]: {
      flexDirection: 'column-reverse',
    },
  },
  leftCol: {
    paddingTop: '1rem',
    width: '100%',
    minWidth: 0, // fix flex shrink issue
  },
  rightCol: {
    maxWidth: '300px',
    flexShrink: 0,
    marginLeft: '1rem',
    [mediaQueryForMobiles]: {
      width: '100%',
      margin: '2rem 0 0',
    },
  },
  dates: {
    marginTop: '2rem',
  },
  dateWrapper: {
    textAlign: 'center',
  },
  date: {
    display: 'block',
    fontSize: '150%',
  },
  timezone: {
    display: 'block',
    marginTop: '0.5rem',
    fontSize: '100%',
  },
  authors: {},
  authorItem: {
    display: 'flex',
    marginBottom: '0.5rem',
    '& > :last-child': {
      width: '100%',
      padding: '0.5rem',
    },
  },
  primaryMetadata: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1rem',

    [mediaQueryForMobiles]: {
      flexDirection: 'column',
    },
  },
  primaryMetadataThumb: {
    marginRight: '1rem',
  },
  thumbnailWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  titleAndAuthor: {
    marginBottom: '0.5rem',
  },
  // controls
  controlGroup: {
    marginBottom: '1rem',
  },
})

const View = () => {
  const { eventId: eventIdOrSlug } = useParams<{ eventId: string }>()
  const getQuery = useCallback<GetQueryFn<FullEvent>>(
    (client) =>
      client
        .from(ViewNames.GetFullEvents)
        .select<string, FullEvent>('*')
        .or(`id.eq.${eventIdOrSlug},slug.eq.${eventIdOrSlug}`),
    [eventIdOrSlug]
  )
  const [isLoading, lastErrorCode, events, , hydrate] = useDataStore<FullEvent>(
    getQuery,
    { queryName: 'view-event', quietHydrate: true }
  )
  const classes = useStyles()
  const isMod = useIsModerator()
  const myUserId = useUserId()

  if (isLoading || !events) {
    return <LoadingIndicator message="Loading event..." />
  }

  if (lastErrorCode !== null) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load event
      </ErrorMessage>
    )
  }

  if (!events.length) {
    return <NoResultsMessage>No events found</NoResultsMessage>
  }

  const event = events[0]
  const {
    id,
    clubid: clubId,
    name,
    description,
    sourceurl,
    modnotes,
    featuredstatus,
    startsat,
    endsat,
    attendance,
    genres,
    tags,
    club,
  } = event

  const myAttendance = attendance.find(
    (attendanceItem) => attendanceItem.createdby == myUserId
  )

  const visibleAttendance = attendance.filter(
    (attendanceItem) => attendanceItem.status !== AttendanceStatus.Abstain
  )

  const isClubOwner = myUserId
    ? club.owneruserids.includes(myUserId) || club.createdby === myUserId
    : false
  const isClubMod = myUserId ? club.moduserids.includes(myUserId) : false
  const isClubStaff = isClubOwner || isClubMod

  return (
    <>
      <Helmet>
        <title>{`${name || '(unnamed)'}`}</title>
        {description ? <meta name="description" content={description} /> : null}
      </Helmet>
      <div className={classes.root}>
        {modnotes ? <PublicEditorNotes notes={modnotes} /> : null}
        {isClubStaff ? (
          <ClubStaffControls>
            <FormControls>
              <HydrateVrchatInstanceButton
                eventId={event.id}
                hydrate={hydrate}
              />
            </FormControls>
          </ClubStaffControls>
        ) : null}
        <div className={classes.primaryMetadata}>
          {/* {thumbnailurl ? (
            <img
              src={thumbnailurl}
              alt="Thumbnail for event"
              width={300}
              className={classes.primaryMetadataThumb}
            />
          ) : null} */}
          <Heading variant="h1">
            <Link to={routes.viewClubWithVar.replace(':clubId', clubId)}>
              {club.name}
            </Link>
            {' / '}
            <Link
              to={routes.viewEventWithVar.replace(':eventId', eventIdOrSlug)}>
              {name}
            </Link>{' '}
          </Heading>
        </div>
        <EventDateRange
          startsAt={new Date(startsat)}
          endsAt={new Date(endsat)}
          className={classes.dates}
        />
        <Heading variant="h2">Genres</Heading>
        <TagList tags={genres} />
        <Heading variant="h2">Tags</Heading>
        <TagList tags={tags} />
        <div className={classes.cols}>
          <div className={classes.leftCol}>
            <Block title="Description">
              {description ? (
                <Markdown source={description} />
              ) : (
                <NoResultsMessage>No description set</NoResultsMessage>
              )}
            </Block>
            <Block title="Performers">
              {event.performances.length ? (
                <PerformanceList performances={event.fullperformances} />
              ) : (
                <NoResultsMessage>
                  No performances set for this event
                </NoResultsMessage>
              )}
            </Block>
            <Block title="Comments">
              <CommentList
                collectionName={CollectionNames.Events}
                parentId={id}
              />
            </Block>
          </div>
          <div className={classes.rightCol}>
            <div className={classes.controlGroup}>
              <VisitVrchatInstanceButton
                instance={event.vrchatinstancecache?.instance || null}
                fetchedAt={event.vrchatinstancecache?.fetchedat}
              />
            </div>
            {sourceurl && (
              <div className={classes.controlGroup}>
                <Button size="large" icon={<LaunchIcon />} url={sourceurl}>
                  Visit Website
                </Button>
              </div>
            )}
            <div className={classes.controlGroup}>
              <EventAttendanceButton
                eventId={event.id}
                myAttendance={myAttendance}
                onDone={hydrate}
              />
              {visibleAttendance.length ? (
                <EventAttendanceResults items={visibleAttendance} />
              ) : null}
            </div>
            {isMod ? (
              <div className={classes.controlGroup}>
                <Button
                  url={routes.editEventWithVar.replace(':eventId', id)}
                  icon={<EditIcon />}
                  color="secondary">
                  Edit Event
                </Button>
              </div>
            ) : null}
            {isMod && (
              <>
                <div className={classes.controlGroup}>
                  <EditorRecordManager
                    id={id}
                    collectionName={CollectionNames.Events}
                    metaCollectionName={CollectionNames.EventsMeta}
                    showApprovalButtons
                    showDeclineReasons={false}
                    // existingApprovalStatus={approvalstatus}
                    showAccessButtons
                    // existingAccessStatus={accessstatus}
                    showEditorNotes
                    existingEditorNotes={modnotes}
                    showFeatureButtons
                    existingFeaturedStatus={featuredstatus}
                    onDone={hydrate}
                  />
                </div>
                <div className={classes.controlGroup}>
                  <HydrateVrchatInstanceButton eventId={id} hydrate={hydrate} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default () => (
  <>
    <Helmet>
      <title>View an event</title>
      <meta
        name="description"
        content="View more details about an event posted on the site."
      />
    </Helmet>
    <View />
  </>
)
