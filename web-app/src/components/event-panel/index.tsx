import styled from '@emotion/styled'
import {
  CollectionNames,
  EventForList,
  PublicEvent,
  ViewNames,
} from 'shared/modules/events'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import { routes } from '@/routes'
import useEventFavoriting from '@/hooks/useEventFavoriting'

import Button from '@/components/button'
import PerformanceList from '@/components/performance-list'
import NoResultsMessage from '@/components/no-results-message'
import Link from '@/components/link'
import CommentList from '@/components/comment-list'
import LazyLoad from '@/components/lazy-load'
import EventAttendanceList from '@/components/event-attendance-list'
import Heading from '@/components/heading'
import Markdown from '@/components/markdown'
import TagList from '@/components/tag-list'
import Dialog from '@/components/dialog'
import Columns from '@/components/columns'
import Column from '@/components/column'
import VisitVrchatInstanceButton from '@/components/visit-vrchat-instance-button'
import useDataStoreItem from '@/hooks/useDataStoreItem'
import { useState } from 'react'
import useInterval from '@/hooks/useInterval'
import { getPrefersBritishSpelling } from '@/utils'
import EventDateRange from '../event-date-range'
import FormControls from '../form-controls'
import ReportButton from '../report-button'

const StyledClubDetails = styled.div`
  font-size: 125%;
  display: flex;
  align-items: center;
  & img {
    width: 50px;
    height: 50px;
    margin-right: 0.5rem;
  }
`

const Desc = styled.div`
  margin: 0.5rem 0;
`

const EventPoster = styled.div`
  padding: 0.5rem;
  & img {
    max-height: calc(100dvh - 64px - 2rem);
    max-width: 100%;
    aspect-ratio: 1 / 1;
  }
`

const FavButtonWrapper = styled.div`
  margin-left: auto;
`

const FavButton = ({ eventId }: { eventId: string }) => {
  const [isFaved, toggleFav] = useEventFavoriting(eventId)
  return (
    <Button
      icon={isFaved ? <FavoriteBorderIcon /> : <FavoriteIcon />}
      onClick={toggleFav}
      color="secondary"
      title="Highlights the event in the timeline (all local)">
      {isFaved
        ? `Stop Favo${getPrefersBritishSpelling() ? 'u' : ''}riting`
        : `Favo${getPrefersBritishSpelling() ? 'u' : ''}rite This Event`}
    </Button>
  )
}

const useEventPoll = (eventId: string): null | EventForList => {
  const [cacheKey, setCacheKey] = useState<undefined | number>(undefined)
  const [, , mostRecentEvent] = useDataStoreItem<EventForList>(
    ViewNames.GetEventsForList,
    cacheKey ? eventId : false,
    {
      cacheKey: cacheKey?.toString(),
    }
  )
  useInterval(() => {
    console.debug(`useEventPoll.poll`, eventId)
    setCacheKey((val) => (val === undefined ? 0 : val + 1))
  }, 10 * 1000)
  return mostRecentEvent || null
}

const EventPanel = ({
  event: incomingEvent,
  onClose,
}: {
  event: EventForList
  onClose: () => void
}) => {
  const mostRecentEvent = useEventPoll(incomingEvent.id)
  const event = mostRecentEvent || incomingEvent
  return (
    <Dialog fullWidth onClose={onClose}>
      <Columns>
        <Column>
          {event.posterurl ? (
            <EventPoster>
              <img src={event.posterurl} alt="Event poster" />
            </EventPoster>
          ) : (
            <NoResultsMessage>This event has no poster</NoResultsMessage>
          )}
        </Column>
        <Column>
          <StyledClubDetails>
            {event.clubthumbnailurl && (
              <img src={event.clubthumbnailurl} alt="Club thumbnail" />
            )}
            <Link to={routes.viewClubWithVar.replace(':clubId', event.clubid)}>
              {event.clubname}
            </Link>
          </StyledClubDetails>
          <Heading variant="h2">
            <Link to={routes.viewEventWithVar.replace(':eventId', event.id)}>
              {event.name}
            </Link>
          </Heading>
          <FormControls>
            <FavButton eventId={event.id} />
            <ReportButton
              type={CollectionNames.Events}
              id={event.id}
              color="secondary"
            />
          </FormControls>
          <EventDateRange startsAt={event.startsat} endsAt={event.endsat} />
          <Heading variant="h3">Instance</Heading>
          <VisitVrchatInstanceButton
            vrchatGroupId={event.vrchatgroupid}
            instance={event.vrchatinstancecache?.instance || null}
            fetchedAt={event.vrchatinstancecache?.fetchedat}
          />
          <Heading variant="h3">Genres</Heading>
          <TagList tags={event.genres} />
          <Heading variant="h3">Tags</Heading>
          <TagList tags={event.tags} />
          <Heading variant="h3">Description</Heading>
          <Desc>
            <Markdown source={event.description} />
          </Desc>
          <Heading variant="h3">Performances</Heading>
          {event.fullperformances.length ? (
            <PerformanceList performances={event.fullperformances} />
          ) : (
            <NoResultsMessage>
              No performances configured for this event
            </NoResultsMessage>
          )}
          <LazyLoad>
            <Heading variant="h3">Attendees</Heading>
            <EventAttendanceList eventId={event.id} showButton />
          </LazyLoad>
          <LazyLoad>
            <Heading variant="h3">Comments</Heading>
            <CommentList
              collectionName={CollectionNames.Events}
              parentId={event.id}
            />
          </LazyLoad>
        </Column>
      </Columns>
    </Dialog>
  )
}

export default EventPanel
