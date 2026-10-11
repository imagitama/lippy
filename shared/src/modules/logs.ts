export enum CollectionNames {
  Logs = 'logs',
}

export interface LogEntry<T> {
  message: string
  data: T | null
  createdat: string
}
