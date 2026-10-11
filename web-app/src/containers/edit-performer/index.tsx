import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from '@unhead/react/helmet'

import * as routes from '@/routes'
import { Performer, CollectionNames } from 'shared/modules/performers'
import editableFields from '@/editable-fields/performers'

import usePermissions from '@/hooks/usePermissions'

import GenericEditor from '@/components/generic-editor'
import Heading from '@/components/heading'
import NoPermissionMessage from '@/components/no-permission-message'

const View = () => {
  const { performerId } = useParams<{ performerId: string }>()
  const isCreating = !performerId || performerId === 'create'

  if (
    !usePermissions(
      isCreating ? routes.createPerformer : routes.editPerformerWithVar
    )
  ) {
    return <NoPermissionMessage />
  }

  return (
    <>
      <Heading variant="h1">{isCreating ? 'Create' : 'Edit'} Performer</Heading>
      <GenericEditor<Performer>
        fields={editableFields}
        collectionName={CollectionNames.Performers}
        id={isCreating ? undefined : performerId}
        analyticsCategory={isCreating ? 'CreatePerformer' : 'EditPerformer'}
        saveBtnAction="Click save performer button"
        cancelBtnAction="Click cancel button"
        successUrl={routes.viewPerformerWithVar.replace(
          ':performerId',
          performerId
        )}
        getSuccessUrl={(newId) =>
          routes.viewPerformerWithVar.replace(
            ':performerId',
            newId || performerId
          )
        }
        cancelUrl={
          isCreating
            ? routes.performers
            : routes.viewPerformerWithVar.replace(':performerId', performerId)
        }
      />
    </>
  )
}

export default () => {
  const { performerId } = useParams<{ performerId: string }>()
  const isCreating = !performerId || performerId === 'create'

  return (
    <>
      <Helmet>
        <title>{isCreating ? 'Create' : 'Edit'} an performer</title>
        <meta
          name="description"
          content={`Use this form to ${
            isCreating ? 'create' : 'edit'
          } an performer.`}
        />
      </Helmet>
      <View />
    </>
  )
}
