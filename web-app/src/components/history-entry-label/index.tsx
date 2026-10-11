import React from 'react'

import { CollectionNames as CommentsCollectionNames } from 'shared/modules/comments'
import { Message, HistoryEntry } from 'shared/modules/history'
import {
  User,
  UserMeta,
  CollectionNames as UsersCollectionNames,
} from 'shared/modules/users'
import {
  FullReport,
  CollectionNames as ReportsCollectionNames,
} from 'shared/modules/reports'
import { CollectionNames as SupportTicketsCollectionNames } from 'shared/modules/supporttickets'
// import { CollectionNames as AuthorsCollectionNames } from 'shared/modules/authors'
import { ApprovalStatus, MetaRecord } from 'shared/modules/common'
import {
  getLabelForAccessStatus,
  getLabelForApprovalStatus,
  getLabelForBanStatus,
  getLabelForPublishStatus,
  getLabelForResolutionStatus,
} from '@/status-changes'

const HistoryEntryLabel = ({
  entry: { message, data, parentid, parenttable, createdby },
}: {
  entry: HistoryEntry
}) => {
  let fields = {}

  if (data !== null) {
    if ('changes' in data && data.changes) {
      fields = data.changes
    } else if ('record' in data && data.record !== null) {
      fields = data.record
    }
  }

  if (!fields) return <>no data found</>

  switch (message) {
    case Message.Create:
      switch (parenttable) {
        case CommentsCollectionNames.Comments:
          return <>commented on</>
        // case AuthorsCollectionNames.Authors:
        //   return <>created the author</>
        case ReportsCollectionNames.Reports:
          return <>created the report</>
        case SupportTicketsCollectionNames.SupportTickets:
          return <>created the support ticket</>
        default:
          return (
            <>created the {parenttable.substring(0, parenttable.length - 1)}*</>
          )
      }
    case Message.Edit:
      switch (parenttable) {
        case UsersCollectionNames.Users:
          if (parentid !== createdby) {
            return <>changed {Object.keys(fields).length} fields</>
          }
          if ((fields as User).username) {
            return <>changed their username</>
          }
          return <>edited their profile</>
        case UsersCollectionNames.UsersMeta:
          if ((fields as UserMeta).banstatus) {
            return (
              <>{getLabelForBanStatus((fields as UserMeta).banstatus)} user</>
            )
          }
          return <>edited the user's internal profile</>
        case UsersCollectionNames.UserPreferences:
          return <>edited their preferences</>
        // case AuthorsCollectionNames.Authors:
        //   return <>edited author</>
        case ReportsCollectionNames.ReportsMeta:
        case SupportTicketsCollectionNames.SupportTicketsMeta:
          if ((fields as FullReport).resolutionstatus) {
            return (
              <>
                {getLabelForResolutionStatus(
                  (fields as FullReport).resolutionstatus
                )}{' '}
                report
              </>
            )
          } else if ((fields as FullReport).resolutionnotes) {
            return <>changed the resolution notes</>
          } else if ((fields as FullReport).assignedto) {
            return <>assigned to someone</>
          } else if ((fields as FullReport).modnotes) {
            return <>changed editor notes</>
          } else {
            return <>changed {Object.keys(fields).join(', ')}</>
          }
        case CommentsCollectionNames.CommentsMeta:
          if ((fields as MetaRecord).accessstatus) {
            return (
              <>
                {getLabelForAccessStatus((fields as MetaRecord).accessstatus!)}{' '}
                comment
              </>
            )
          } else {
            return <>changed {Object.keys(fields).join(', ')}</>
          }
      }
  }

  return (
    <>
      Unknown message "{parenttable}/{parent}" - "{message}"<br />
      <textarea>{JSON.stringify(data, null, '  ')}</textarea>
    </>
  )
}

export default HistoryEntryLabel
