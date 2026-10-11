import { FullNotification } from 'shared/modules/notifications'

export enum NotificationEvent {
  COMMENT_ON_CLUB = 'COMMENT_ON_CLUB',
  COMMENT_ON_USER = 'COMMENT_ON_USER',
  COMMENT_ON_REPORT = 'COMMENT_ON_REPORT', // and support tickets
  REPORT_CREATED = 'REPORT_CREATED', // and support tickets
  DIGEST = 'DIGEST',
  REPORT_RESOLUTION_CHANGED = 'REPORT_RESOLUTION_CHANGED', // and support tickets
  USER_CHANGED = 'USER_CHANGED', // banned, role change, etc.
  EVENT_APPROVED = 'EVENT_APPROVED',
  EVENT_FEATURED = 'EVENT_FEATURED',
}

// values are all-caps from legacy code
export enum NotificationMethod {
  Web = 'WEB',
  Email = 'EMAIL',
  Discord = 'DISCORD', // not used
}

export const defaultNotificationPrefs = {
  events: {
    [NotificationEvent.COMMENT_ON_CLUB]: true,
    [NotificationEvent.COMMENT_ON_USER]: true,
    [NotificationEvent.COMMENT_ON_REPORT]: true,
    [NotificationEvent.REPORT_CREATED]: true,
    [NotificationEvent.DIGEST]: true,
    [NotificationEvent.REPORT_RESOLUTION_CHANGED]: true,
    [NotificationEvent.USER_CHANGED]: true,
    [NotificationEvent.EVENT_APPROVED]: true,
    [NotificationEvent.EVENT_FEATURED]: true,
  },
  methods: {
    [NotificationMethod.Web]: true,
    [NotificationMethod.Email]: true,
    [NotificationMethod.Discord]: true,
  },
}

export const getLabelForNotification = ({
  parentdata: parentData,
  parenttable: collectionName,
  event,
  message,
  data,
}: FullNotification<any, any>): string => {
  if (message) return message

  return event // TODO: better
}

export const getLinkUrl = ({
  parentid: parentId,
  parenttable: collectionName,
  event,
  data,
}: FullNotification<any, any>): string | undefined => {
  return undefined
}
