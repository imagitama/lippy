import React from 'react'

import { ViewNames, FullPerformer } from 'shared/modules/performers'

import useDatabaseQuery from '@/hooks/useDatabaseQuery'

import LoadingIndicator from '@/components/loading-indicator'
import ErrorMessage from '@/components/error-message'
import NoResultsMessage from '@/components/no-results-message'
import PerformerResults from '@/components/performer-results'
import FormControls from '@/components/form-controls'
import { routes } from '@/routes'
import Button, { CreateButton } from '@/components/button'

export default () => {
  const [isLoading, lastErrorCode, performers] =
    useDatabaseQuery<FullPerformer>(ViewNames.GetMyPerformers, [], {
      queryName: 'my-performers',
    })

  if (isLoading || !performers) {
    return <LoadingIndicator message="Loading your performers..." />
  }

  if (lastErrorCode) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load your performers
      </ErrorMessage>
    )
  }

  if (!performers.length) {
    return (
      <>
        <NoResultsMessage>You do not have any performers</NoResultsMessage>
        <FormControls>
          <CreateButton url={routes.createPerformer} size="large">
            Create Performer
          </CreateButton>
        </FormControls>
      </>
    )
  }

  return <PerformerResults performers={performers} />
}
