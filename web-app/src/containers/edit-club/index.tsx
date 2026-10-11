import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from '@unhead/react/helmet'

import * as routes from '@/routes'
import { Club, CollectionNames } from 'shared/modules/clubs'
import editableFields from '@/editable-fields/clubs'

import usePermissions from '@/hooks/usePermissions'

import GenericEditor from '@/components/generic-editor'
import Heading from '@/components/heading'
import NoPermissionMessage from '@/components/no-permission-message'
import useQueryParam from '@/hooks/useQueryParam'
import CreateClubFromVrchatForm from './components/create-club-from-vrchat-form'

const View = () => {
  const prefillUrl = useQueryParam('url')
  const { clubId } = useParams<{ clubId: string }>()
  const isCreating = !clubId || clubId === 'create'

  if (
    !usePermissions(isCreating ? routes.createClub : routes.editClubWithVar)
  ) {
    return <NoPermissionMessage />
  }

  if (clubId) {
    return (
      <>
        <Heading variant="h1">{isCreating ? 'Create' : 'Edit'} Club</Heading>
        <GenericEditor<Club>
          fields={editableFields}
          collectionName={CollectionNames.Clubs}
          id={isCreating ? undefined : clubId}
          analyticsCategory={isCreating ? 'CreateClub' : 'EditClub'}
          saveBtnAction="Click save club button"
          cancelBtnAction="Click cancel button"
          successUrl={routes.viewClubWithVar.replace(':clubId', clubId)}
          getSuccessUrl={(newId) =>
            routes.viewClubWithVar.replace(':clubId', newId || clubId)
          }
          cancelUrl={
            isCreating
              ? routes.clubs
              : routes.viewClubWithVar.replace(':clubId', clubId)
          }
        />
      </>
    )
  }

  return <CreateClubFromVrchatForm />
}

export default () => {
  const { clubId } = useParams<{ clubId: string }>()
  const isCreating = !clubId || clubId === 'create'

  return (
    <>
      <Helmet>
        <title>{isCreating ? 'Create' : 'Edit'} an club</title>
        <meta
          name="description"
          content={`Use this form to ${
            isCreating ? 'create' : 'edit'
          } an club.`}
        />
      </Helmet>
      <View />
    </>
  )
}
