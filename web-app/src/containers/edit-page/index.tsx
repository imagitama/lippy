import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from '@unhead/react/helmet'

import * as routes from '@/routes'
import { CollectionNames } from 'shared/modules/pages'
import editableFields from '@/editable-fields/pages'

import usePermissions from '@/hooks/usePermissions'

import GenericEditor from '@/components/generic-editor'
import Heading from '@/components/heading'
import NoPermissionMessage from '@/components/no-permission-message'

const View = () => {
  const { parentName, pageName } = useParams<{
    parentName: string
    pageName?: string
  }>()
  const isCreating = parentName === 'create'

  if (!usePermissions(routes.editPageWithParentAndPageVar)) {
    return <NoPermissionMessage />
  }

  return (
    <>
      <Heading variant="h1">
        {isCreating ? 'Create Page' : `Edit Page ${parentName}/${pageName}`}
      </Heading>
      <GenericEditor
        fields={editableFields}
        collectionName={CollectionNames.Pages}
        id={isCreating ? undefined : pageName}
        analyticsCategory={isCreating ? 'CreatePage' : 'EditPage'}
        saveBtnAction="Click save button"
        cancelBtnAction="Click cancel button"
        successUrl={routes.pagesWithParentAndPageVar
          .replace(':parentName', parentName)
          .replace(':pageName', pageName || '')}
        cancelUrl={routes.pagesWithParentAndPageVar
          .replace(':parentName', parentName)
          .replace(':pageName', pageName || '')}
      />
    </>
  )
}

export default () => {
  return (
    <>
      <Helmet>
        <title>Edit a page</title>
        <meta name="description" content={`Use this form to edit a page`} />
      </Helmet>
      <View />
    </>
  )
}
