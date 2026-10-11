import React from 'react'
import AttachmentMeta from '@/components/attachment-meta'
import Link from '@/components/link'
import useIsModerator from '@/hooks/useIsModerator'
import {
  Attachment,
  FullAttachment,
  isFullAttachment,
} from 'shared/modules/attachments'

import * as routes from '@/routes'
import Paper from '@/components/paper'

const getParentLink = (parentTable: string, parentId: string): string => {
  switch (parentTable) {
    default:
      return '#error'
  }
}

const getParentLabel = (parentTable: string, parentId: string): string => {
  switch (parentTable) {
    default:
      return 'error'
  }
}

const AttachmentCaption = ({
  attachment,
  includeMeta,
  includeParents,
  className,
}: {
  attachment: FullAttachment | Attachment
  includeMeta: boolean
  includeParents: boolean
  className?: string
}) => {
  const isMod = useIsModerator()
  return (
    <Paper className={className} noPadding>
      {includeParents ? (
        <>
          Posted by{' '}
          <Link
            to={routes.viewUserWithVar.replace(
              ':userId',
              attachment.createdby
            )}>
            {isFullAttachment(attachment)
              ? attachment.createdbyusername
              : '(no name)'}
          </Link>
          {includeParents && attachment.parenttable && attachment.parentid ? (
            <>
              {' '}
              for{' '}
              <Link
                to={getParentLink(attachment.parenttable, attachment.parentid)}>
                {getParentLabel(attachment.parenttable, attachment.parentid)}
              </Link>
            </>
          ) : null}
        </>
      ) : null}
      {includeParents && includeMeta ? (
        <>
          <br />
          <br />
        </>
      ) : null}
      {includeMeta || isMod ? <AttachmentMeta attachment={attachment} /> : null}
    </Paper>
  )
}

export default AttachmentCaption
