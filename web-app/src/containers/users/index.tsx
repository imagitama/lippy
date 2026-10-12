import React, { useCallback } from 'react'
import { Helmet } from '@unhead/react/helmet'
import { useLocation } from 'react-router'

import * as routes from '@/routes'
import { User, ViewNames, UserForList, UserRoles } from 'shared/modules/users'

import UserResults from '@/components/user-results'
import Heading from '@/components/heading'
import PaginatedView, { GetQueryFn } from '@/components/paginated-view'
import Link from '@/components/link'

const sortKey = 'view-users'

const Renderer = ({ items }: { items?: User[] }) => (
  <UserResults users={items!} />
)

enum SubView {
  ALL = 'all',
  STAFF = 'staff',
  BANNED = 'banned',
}

export default () => {
  const location = useLocation()
  const isStaff = location.pathname.includes('staff')

  const getQuery = useCallback<GetQueryFn<UserForList, SubView>>(
    (query, selectedSubView, activeFilters) => {
      if (selectedSubView === SubView.STAFF) {
        query = query.or(
          `role.eq.${UserRoles.Moderator},role.eq.${UserRoles.Admin}`
        )
      }

      return query
    },
    []
  )

  return (
    <>
      <Helmet>
        <title>View a list of users that are signed up on the site</title>
        <meta
          name="description"
          content={`Find every user that has signed up.`}
        />
      </Helmet>
      <Heading variant="h1">
        {' '}
        <Link to={routes.users}>Users</Link>
      </Heading>
      <PaginatedView<UserForList>
        itemNamePlural="users"
        viewName={ViewNames.GetUsersForList}
        name={sortKey}
        getQuery={getQuery}
        subViews={[
          {
            id: SubView.STAFF,
            label: 'Staff',
          },
        ]}
        defaultSubView={isStaff ? SubView.STAFF : undefined}
        sortOptions={[
          {
            label: 'Sign up date',
            fieldName: 'createdat',
          },
          {
            label: 'Username',
            fieldName: 'username',
          },
        ]}
        defaultFieldName="createdat"
        urlWithSubViewNameAndPageNumberVar={routes.viewUsersWithPageNumberVar}>
        <Renderer />
      </PaginatedView>
    </>
  )
}
