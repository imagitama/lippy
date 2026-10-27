import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Helmet } from '@unhead/react/helmet'

import * as routes from '@/routes'
import {
  CollectionNames,
  Event,
  EventFields,
  EventForList,
} from 'shared/modules/events'
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
import ImportVrchatEventForm from '@/components/import-vrchat-event-form'
import useDownloadExternalImage from '@/hooks/useDownloadExternalImage'
import LoadingIndicator from '@/components/loading-indicator'
import ErrorMessage from '@/components/error-message'

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
  const [vrcPosterImageUrl, setVrcPosterImageUrl] = useState<null | string>(
    null
  )
  const [prefillFields, setPrefillFields] =
    useState<null | Partial<EventFields>>(null)
  const [isHidingImport, setIsHidingImport] = useState(false)
  const [isDownloading, lastErrorCodeDownloading, posterLocalUrl] =
    useDownloadExternalImage(vrcPosterImageUrl || false)

  if (!isLoggedIn) {
    return <NotLoggedInMessage />
  }

  if (isDownloading) return <LoadingIndicator message="Downloading poster..." />

  if (lastErrorCodeDownloading !== null)
    return (
      <ErrorMessage errorCode={lastErrorCodeDownloading}>
        Failed to download poster
      </ErrorMessage>
    )

  if (vrcPosterImageUrl && !posterLocalUrl)
    return <LoadingIndicator message="Waiting for poster..." />

  const onImportSuccess = async (
    eventFields: Partial<EventFields>,
    posterImageUrl: string | null
  ) => {
    console.debug(`import success`, eventFields, posterImageUrl)

    setVrcPosterImageUrl(posterImageUrl)
    setPrefillFields(eventFields)
  }

  const editableFieldsToUse = posterLocalUrl
    ? editableFields.map((field) =>
        field.name === 'posterurl'
          ? {
              ...field,
              preloadImageUrl: posterLocalUrl,
            }
          : field
      )
    : editableFields

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
      {providedClubId && !isHidingImport && !prefillFields ? (
        <InfoMessage title="Import VRChat Group Event">
          You can import an event from your VRChat group by clicking this
          button.
          <br />
          <ImportVrchatEventForm
            clubId={providedClubId}
            onSuccess={onImportSuccess}
            onCancel={() => setIsHidingImport(true)}
          />
        </InfoMessage>
      ) : (
        <GenericEditor<Event>
          fields={editableFieldsToUse}
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
            ...(prefillFields || {}),
          }}
          isAccordion
          startExpanded
          onFieldsChanged={(newFields) => {
            setPreviewFields(newFields)
          }}
          showControls
        />
      )}
    </>
  )
}
