import React, { useCallback } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

import useDataStore from '@/hooks/useDataStore'
import useIsModerator from '@/hooks/useIsModerator'
import useIsLoggedIn from '@/hooks/useIsLoggedIn'

import { BanStatus } from 'shared/modules/users'
import { getQueryParam } from '@/utils'
import { trackAction } from '@/analytics'
import { FullComment, ViewNames } from 'shared/modules/comments'

import CommentItem from '@/components/comment'
import ErrorMessage from '@/components/error-message'
import NoResultsMessage from '@/components/no-results-message'
import AddCommentForm from '@/components/add-comment-form'
import useDatabaseQuery, { Operators } from '@/hooks/useDatabaseQuery'

const CommentList = ({
  collectionName,
  parentId,
  shimmer = false,
  className = '',
  getPrivate = false,
  hideWarning,
}: {
  collectionName: string
  parentId: string
  shimmer?: boolean
  className?: string
  getPrivate?: boolean
  hideWarning?: boolean
}) => {
  const isMod = useIsModerator()

  const [isLoading, lastErrorCode, results, hydrate] =
    useDatabaseQuery<FullComment>(
      isMod ? ViewNames.GetFullComments : ViewNames.GetPublicComments,
      shimmer
        ? false
        : [
            ['parenttable', Operators.EQUALS, collectionName],
            ['parentid', Operators.EQUALS, parentId],
          ],
      { queryName: 'get-comments' }
    )

  if (isLoading || shimmer) {
    return (
      <div className={className}>
        <CommentItem shimmer />
        <CommentItem shimmer />
        <CommentItem shimmer />
      </div>
    )
  }

  if (lastErrorCode !== null) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load{getPrivate ? ' private' : ''} comments
      </ErrorMessage>
    )
  }

  const commentIdToScrollTo = getQueryParam('comment')

  const filterComments = (comment: FullComment): boolean =>
    comment.createdbybanstatus !== BanStatus.Banned || isMod === true

  return (
    <div className={className}>
      <div>
        {results && results.length ? (
          results
            .filter(filterComments)
            .map((result) => (
              <CommentItem
                key={result.id}
                comment={result}
                isHighlighted={commentIdToScrollTo === result.id}
                performScroll={commentIdToScrollTo === result.id}
                hydrate={hydrate}
              />
            ))
        ) : (
          <NoResultsMessage>
            No{getPrivate ? ' private' : ''} comments yet
          </NoResultsMessage>
        )}
      </div>
      {collectionName && parentId && (
        <AddCommentForm
          collectionName={collectionName}
          parentId={parentId}
          asPrivate={getPrivate}
          onAddClick={() =>
            trackAction('CommentList', 'Click add comment button', {
              collectionName,
              parentId,
            })
          }
          onDone={() => hydrate()}
        />
      )}
    </div>
  )
}

export default CommentList
