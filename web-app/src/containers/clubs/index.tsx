import React from 'react'
import { Helmet } from '@unhead/react/helmet'

import * as routes from '@/routes'
import { Club, ClubForList, ViewNames } from 'shared/modules/clubs'

import Link from '@/components/link'
import Heading from '@/components/heading'
import BodyText from '@/components/body-text'
import ClubResults from '@/components/club-results'
import PaginatedView from '@/components/paginated-view'

const Renderer = ({ items }: { items?: ClubForList[] }) => (
  <ClubResults clubs={items || []} />
)

const ClubsView = () => {
  return (
    <>
      <Helmet>
        <title>View all clubs</title>
        <meta name="description" content="Browse the clubs of the site." />
      </Helmet>
      <Heading variant="h1">
        <Link to={routes.clubs}>Clubs</Link>
      </Heading>
      <BodyText>A list of all clubs.</BodyText>
      <PaginatedView<ClubForList>
        itemNamePlural="clubs"
        viewName={ViewNames.GetPublicClubs}
        moderatorViewName={ViewNames.GetClubsForList}
        name="clubs"
        sortOptions={[
          {
            label: 'Name',
            fieldName: 'name',
          },
          {
            label: 'Created on',
            fieldName: 'createdat',
          },
        ]}
        defaultFieldName={'name'}
        urlWithSubViewNameAndPageNumberVar={routes.viewClubsWithPageNumberVar}
        createUrl={routes.createClub}>
        <Renderer />
      </PaginatedView>
    </>
  )
}

export default ClubsView
