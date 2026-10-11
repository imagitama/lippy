import * as routes from './routes'
import { HistoryEntry, Message } from 'shared/modules/history'

export const getMessageLabel = ({ message }: HistoryEntry) => {
  switch (message) {
    case Message.Create:
      return 'Created'
    case Message.Edit:
      return 'Edited'
    default:
      return message
  }
}

export const getLinkUrl = ({
  message,
  parentid: parentId,
  parenttable: parentTable,
}: HistoryEntry) => {
  switch (parentTable) {
    default:
      return `Parent: ${parentTable}`
  }
}
