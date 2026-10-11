import React from 'react'

import { ViewNames, FullClub } from 'shared/modules/clubs'

import useDatabaseQuery from '@/hooks/useDatabaseQuery'

import LoadingIndicator from '@/components/loading-indicator'
import ErrorMessage from '@/components/error-message'
import NoResultsMessage from '@/components/no-results-message'
import ClubResults from '@/components/club-results'
import FormControls from '@/components/form-controls'
import { CreateButton } from '@/components/button'
import { routes } from '@/routes'

export default () => {
  const [isLoading, lastErrorCode, clubs] = useDatabaseQuery<FullClub>(
    ViewNames.GetMyClubs,
    [],
    {
      queryName: 'my-clubs',
    }
  )

  if (isLoading || !clubs) {
    return <LoadingIndicator message="Loading your clubs..." />
  }

  if (lastErrorCode) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load your clubs
      </ErrorMessage>
    )
  }

  if (!clubs.length) {
    return (
      <>
        <NoResultsMessage>
          You are not a staff member for any clubs
        </NoResultsMessage>
        <FormControls>
          <CreateButton url={routes.createClub} size="large">
            Create Club
          </CreateButton>
        </FormControls>
      </>
    )
  }

  return <ClubResults clubs={clubs} />
}
