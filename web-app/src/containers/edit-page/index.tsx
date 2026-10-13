import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from '@unhead/react/helmet'

import * as routes from '@/routes'
import { CollectionNames, Page } from 'shared/modules/pages'
import editableFields from '@/editable-fields/pages'

import usePermissions from '@/hooks/usePermissions'

import GenericEditor from '@/components/generic-editor'
import Heading from '@/components/heading'
import NoPermissionMessage from '@/components/no-permission-message'

const View = () => {
  const { parentName, pageName } = useParams<{
    parentName?: string
    pageName: string
  }>()

  const isChildPage = parentName && pageName
  const isCreating = location.href.includes('/create')

  if (!usePermissions(routes.editPageWithParentAndPageVar)) {
    return <NoPermissionMessage />
  }

  return (
    <>
      <Heading variant="h1">
        {isCreating
          ? 'Create Page'
          : `Edit Page ${parentName ? ` ${parentName}/` : ''}${pageName}`}
      </Heading>
      <GenericEditor<Page>
        fields={editableFields}
        collectionName={CollectionNames.Pages}
        id={isCreating ? undefined : pageName}
        analyticsCategory={isCreating ? 'CreatePage' : 'EditPage'}
        saveBtnAction="Click save button"
        cancelBtnAction="Click cancel button"
        successUrl={
          isChildPage
            ? routes.pagesWithParentAndPageVar
                .replace(':parentName', parentName)
                .replace(':pageName', pageName)
            : `/${pageName}`
        }
        cancelUrl={
          isChildPage
            ? routes.pagesWithParentAndPageVar
                .replace(':parentName', parentName)
                .replace(':pageName', pageName)
            : `/${pageName}`
        }
        overrideFields={{
          id: pageName,
          parentid: parentName,
        }}
      />
    </>
  )
}

export default () => {
  return (
    <>
      <Helmet>
        <title>Edit a page</title>
        <meta
          name="description"
          content={`Use this form to create or edit a page`}
        />
      </Helmet>
      <View />
    </>
  )
}
