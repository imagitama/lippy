export interface Notification<TData> extends Record<string, any> {
  id: string
  recipient: string
  event: string
  message: string | null
  parentid: string | null
  parenttable: string | null
  data: TData | null
  createdat: Date
}

export interface FullNotification<TParent, TData> extends Notification<TData> {
  parentdata: TParent | null
}

export enum CollectionNames {
  Notifications = 'notifications',
}

export enum ViewNames {
  GetFullNotification = 'getfullnotification',
}
