import { type FullReport } from './reports.ts'

export enum AdminQueueItemType {
  Report = 'report',
}

export interface AdminQueueItemBase<T> {
  id: number
  type: AdminQueueItemType
  record: T
  createdat: string
}

export interface ReportAdminQueueItem extends AdminQueueItemBase<FullReport> {
  type: AdminQueueItemType.Report
}

export type AdminQueueItem = ReportAdminQueueItem

export enum ViewNames {
  GetAdminQueue = 'getadminqueue',
}
