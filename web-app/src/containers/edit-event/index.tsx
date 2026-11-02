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
  Club,
  CollectionNames as ClubsCollectionNames,
} from 'shared/modules/clubs'
import {
  FullPerformer,
  Performer,
  CollectionNames as PerformersCollectionNames,
} from 'shared/modules/performers'
import {
  FullPerformance,
  Performance,
  PerformanceFields,
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
import ImportFromTimelineForm from '@/components/import-timeline-event-form'
import FormControls from '@/components/form-controls'
import Button from '@/components/button'
import useDataStoreItem from '@/hooks/useDataStoreItem'

enum ImportMode {
  VRChat = 'vrchat',
  Timeline = 'timeline',
  Manual = 'manual',
}

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
  const [externalPosterImageUrl, setExternalPosterImageUrl] = useState<
    null | string
  >(null)
  const [prefillFields, setPrefillFields] =
    useState<null | Partial<EventFields>>(null)
  const [isDownloading, lastErrorCodeDownloading, posterLocalUrl] =
    useDownloadExternalImage(externalPosterImageUrl || false)
  const [isLoadingClub, lastErrorCodeClub, club] = useDataStoreItem<Club>(
    ClubsCollectionNames.Clubs,
    providedClubId || false
  )
  const [importMode, setImportMode] = useState<null | ImportMode>(null)
  const [importedPerformances, setImportedPerformances] = useState<
    null | PerformanceFields[]
  >(null)

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

  if (externalPosterImageUrl && !posterLocalUrl)
    return <LoadingIndicator message="Waiting for poster..." />

  const onImportSuccess = async (
    eventFields: Partial<EventFields>,
    posterImageUrl: string | null,
    performances: PerformanceFields[] | null
  ) => {
    console.debug(`import success`, eventFields, posterImageUrl, performances)

    setImportedPerformances(performances)
    setExternalPosterImageUrl(posterImageUrl)
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

  if (isLoadingClub) return <LoadingIndicator message="Loading club..." />
  if (lastErrorCodeClub !== null)
    return (
      <ErrorMessage errorCode={lastErrorCodeClub}>
        Failed to load club
      </ErrorMessage>
    )

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
      {providedClubId && importMode === null && !prefillFields ? (
        <>
          <InfoMessage
            title="Import VRChat Event"
            controls={
              <Button onClick={() => setImportMode(ImportMode.VRChat)}>
                Import from VRChat
              </Button>
            }>
            We can import any calendar event from your VRChat group.
          </InfoMessage>
          <InfoMessage
            title="Import Timeline Event (experimental)"
            controls={
              <Button onClick={() => setImportMode(ImportMode.Timeline)}>
                Import from Timeline
              </Button>
            }>
            We can import any event from Timeline (vrc.tl) except there is an
            extra manual step.
          </InfoMessage>
          <InfoMessage
            title="Manual"
            controls={
              <Button
                onClick={() => setImportMode(ImportMode.Manual)}
                color="secondary">
                Create Manually
              </Button>
            }></InfoMessage>
        </>
      ) : club && importMode === ImportMode.VRChat && !prefillFields ? (
        <ImportVrchatEventForm
          clubId={club.id}
          onSuccess={(fields, posterImageUrl) =>
            onImportSuccess(fields, posterImageUrl, null)
          }
          onCancel={() => setImportMode(null)}
        />
      ) : club &&
        club.vrchatgroupid &&
        importMode === ImportMode.Timeline &&
        !prefillFields ? (
        <ImportFromTimelineForm
          clubId={club.id}
          clubVrcGroupId={club.vrchatgroupid}
          onSuccess={onImportSuccess}
          onCancel={() => setImportMode(null)}
        />
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
          extraFormData={{
            performances: importedPerformances,
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
