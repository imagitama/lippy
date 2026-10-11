import React from 'react'
import { Helmet } from '@unhead/react/helmet'

import * as routes from '@/routes'
import { PerformerForList, ViewNames } from 'shared/modules/performers'

import Link from '@/components/link'
import Heading from '@/components/heading'
import BodyText from '@/components/body-text'
import PerformerResults from '@/components/performer-results'
import PaginatedView from '@/components/paginated-view'

const Renderer = ({ items }: { items?: PerformerForList[] }) => (
  <PerformerResults performers={items || []} />
)

const PerformersView = () => {
  return (
    <>
      <Helmet>
        <title>View all performers</title>
        <meta name="description" content="Browse the performers of the site." />
      </Helmet>
      <Heading variant="h1">
        <Link to={routes.performers}>Performers</Link>
      </Heading>
      <BodyText>A list of all performers for events.</BodyText>
      <PaginatedView<PerformerForList>
        itemNamePlural="performers"
        viewName={ViewNames.GetPublicPerformers}
        moderatorViewName={ViewNames.GetPerformersForList}
        name="performers"
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
        urlWithSubViewNameAndPageNumberVar={
          routes.viewPerformersWithPageNumberVar
        }
        createUrl={routes.createPerformer}>
        <Renderer />
      </PaginatedView>
    </>
  )
}

export default PerformersView
