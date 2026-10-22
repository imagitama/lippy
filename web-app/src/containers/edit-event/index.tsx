import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Helmet } from '@unhead/react/helmet'

import * as routes from '@/routes'
import { CollectionNames, Event, EventForList } from 'shared/modules/events'
import {
  FullPerformer,
  Performer,
  CollectionNames as PerformersCollectionNames,
} from 'shared/modules/performers'
import {
  FullPerformance,
  CollectionNames as PerformancesCollectionNames,
  ViewNames as PerformancesViewNames,
} from 'shared/modules/performances'
import editableFields from '@/editable-fields/events'
import { addDays } from '@/utils/dates'
import useIsLoggedIn from '@/hooks/useIsLoggedIn'
import useQueryParam from '@/hooks/useQueryParam'

import GenericEditor from '@/components/generic-editor'
import Heading from '@/components/heading'
import NotLoggedInMessage from '@/components/not-logged-in-message'
import HorizontalTimeline from '@/components/horizontal-timeline'
import WarningMessage from '@/components/warning-message'
import InfoMessage from '@/components/info-message'
import useDataStoreItems from '@/hooks/useDataStoreItems'

// const usePerformerNamesById = (
//   ids: string[]
// ): [boolean, string | null, { id: string; name: string }[] | null] => {
//   const [isLoading, lastErrorCode, results] = useDataStoreItems<FullPerformance>(
//     PerformancesViewNames.GetFullPerformances,
//     ids
//   )
//   return [
//     isLoading,
//     lastErrorCode,
//     results?.map((perf) => ({
//       id: perf.id,
//       name: perf.name,
//     })) || null,
//   ]
// }

// const EventPreview = ({ event }: { event: Partial<Event> }) => {
//   const [, , performerIdsAndNames] = usePerformerNamesById(
//     event.performances
//       ?.filter((perf) => perf.performerid)
//       .map((perf) => perf.performerid!) || []
//   )

//   if (!event.startsat && !event.endsat)
//     return (
//       <WarningMessage>
//         Need a start and end date to show a preview
//       </WarningMessage>
//     )

//   const mockFullPerformances: FullPerformance[] =
//     event.performances?.map((perf) => {
//       const perfName =
//         perf.performerid && performerIdsAndNames
//           ? performerIdsAndNames.find((item) => item.id === perf.performerid)
//               ?.name || 'Loading...'
//           : perf.performername || perf.performerid || ''
//       return {
//         ...perf,
//         fullperformername: perfName,
//       }
//     }) || []

//   const mockEventForList = {
//     ...event,
//     fullperformances: mockFullPerformances,
//     clubname: 'My Club',
//   } as EventForList

//   return (
//     <div style={{ height: '200px' }}>
//       <HorizontalTimeline
//         events={[mockEventForList]}
//         now={new Date(event.startsat!)}
//       />
//     </div>
//   )
// }

export default () => {
  const { eventId } = useParams<{ eventId?: string }>()
  const isCreating = !eventId || eventId === 'create'
  const isLoggedIn = useIsLoggedIn()
  const providedDateIso = useQueryParam('date')
  const providedDateIsoEnd = providedDateIso
    ? addDays(new Date(providedDateIso), 1).toISOString()
    : undefined
  const providedClubId = useQueryParam('club')
  const [previewFields, setPreviewFields] = useState<null | Partial<Event>>(
    null
  )

  if (!isLoggedIn) {
    return <NotLoggedInMessage />
  }

  return (
    <>
      <Helmet>
        <title>{isCreating ? 'Create' : 'Edit'} an event</title>
        <meta
          name="description"
          content={`Use this form to ${
            isCreating ? 'create' : 'edit'
          } an event.`}
        />
      </Helmet>
      <Heading variant="h1">{isCreating ? 'Create' : 'Edit'} Event</Heading>
      {/* {previewFields ? (
        <EventPreview event={previewFields} />
      ) : (
        <InfoMessage>Set a start and end date to show a preview</InfoMessage>
      )} */}
      <GenericEditor<Event>
        fields={editableFields}
        collectionName={CollectionNames.Events}
        id={eventId}
        analyticsCategory={`${eventId ? 'Edit' : 'Create'}Event`}
        saveBtnAction="Click save button"
        cancelBtnAction="Click cancel button"
        getSuccessUrl={(newId) =>
          newId
            ? routes.viewEventWithVar.replace(':eventId', newId)
            : routes.events
        }
        cancelUrl={
          eventId
            ? routes.viewEventWithVar.replace(':eventId', eventId)
            : routes.events
        }
        overrideSomeFields={{
          ...(providedDateIso
            ? { startsat: providedDateIso, endsat: providedDateIsoEnd }
            : {}),
          ...(providedClubId
            ? {
                clubid: providedClubId,
              }
            : {}),
        }}
        isAccordion
        startExpanded
        onFieldsChanged={(newFields) => {
          setPreviewFields(newFields)
        }}
        showControls
      />
    </>
  )
}
