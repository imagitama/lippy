import { type FullNotification } from './modules/notifications.ts'

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

export enum NotificationMethod {
  Web = 'web',
  Email = 'email',
  Discord = 'discord', // not used
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
