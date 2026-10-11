import React, { useCallback } from 'react'
import { Helmet } from '@unhead/react/helmet'
import { useParams } from 'react-router'

import { CollectionNames, FullTag } from 'shared/modules/tags'
import * as routes from '@/routes'
import { getLabelForTag } from '@/utils/tags'
import { AccessStatus } from 'shared/modules/common'
import { ViewNames } from 'shared/modules/tags'

import useIsModerator from '@/hooks/useIsModerator'
import useDataStoreItem from '@/hooks/useDataStoreItem'

import Heading from '@/components/heading'
import ErrorMessage from '@/components/error-message'
import EditorRecordManager from '@/components/editor-record-manager'
import BodyText from '@/components/body-text'
import Button from '@/components/button'
import PublicEditorNotes from '@/components/public-editor-notes'
import Message from '@/components/message'
import { GetQueryFn } from '@/components/paginated-view'

export default () => {
  const { tag } = useParams<{ tag: string }>()
  const isMod = useIsModerator()
  const [, , fullTag, hydrate] = useDataStoreItem<FullTag>(
    ViewNames.GetFullTags,
    tag,
    { queryName: 'view-tag' }
  )

  if (!tag) {
    return <ErrorMessage>You must provide a tag</ErrorMessage>
  }

  return (
    <>
      <Helmet>
        <title>View tag {tag}</title>
        <meta
          name="description"
          content={`View more info about the tag ${tag} including stats.`}
        />
      </Helmet>
      {fullTag && fullTag.accessstatus === AccessStatus.Deleted ? (
        <Message>This tag has been deleted</Message>
      ) : null}
      {fullTag && fullTag.modnotes ? (
        <PublicEditorNotes notes={fullTag.modnotes} />
      ) : null}
      <Heading variant="h1">
        {tag}
        {fullTag ? ` (${fullTag.count})` : ''}
      </Heading>{' '}
      {fullTag ? (
        <Heading variant="h2">
          {fullTag.label || getLabelForTag(fullTag.id)}
        </Heading>
      ) : null}
      {fullTag ? <BodyText>{fullTag.description}</BodyText> : null}
      <Button url={routes.createTagSuggestionWithVar.replace(':tagName', tag)}>
        Suggest Change
      </Button>
      {isMod && fullTag ? (
        <EditorRecordManager
          id={tag}
          metaCollectionName={CollectionNames.TagsMeta}
          editUrl={routes.editTagWithVar.replace(':tag', tag)}
          showAccessButtons
          existingAccessStatus={fullTag.accessstatus}
          onDone={hydrate}
        />
      ) : null}
    </>
  )
}
