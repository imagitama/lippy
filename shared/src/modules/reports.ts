import { CollectionNames as CommentsCollectionNames } from './comments.ts'
import { ResolutionStatus } from './common.ts'

const commonReportReasonKeys = {
  OFFENSIVE_CONTENT: 'OFFENSIVE_CONTENT',
  SPAM: 'SPAM',
  OTHER: 'OTHER',
}

export const reportReasonsKeysByCollection = {}

export const getLabelForReason = (
  reason: string,
  collectionName: string,
): string => {
  const reasons = getReasonsForCollectionName(collectionName)
  const meta = reasons.find((item) => item.value === reason)
  if (!meta) return reason
  return meta.label
}

const commonReasons: ReportReason[] = [
  {
    value: commonReportReasonKeys.OFFENSIVE_CONTENT,
    label: 'Offensive content',
    description: 'The content contains profanity or other offensive content',
  },
  {
    value: commonReportReasonKeys.SPAM,
    label: 'Spam or bot message',
    description: 'The message is spam or comes from a bot',
  },
  {
    value: commonReportReasonKeys.OTHER,
    label: 'Other/custom reason',
    description: 'Other/custom reason (use comments field)',
  },
]

const reasonsByCollectionName: { [collectionName: string]: ReportReason[] } = {
  [CommentsCollectionNames.Comments]: [],
}

interface ReportReason {
  value: string
  label: string
  description: string
}

export const getReasonsForCollectionName = (
  collectionName: string,
): ReportReason[] => {
  const result = reasonsByCollectionName[collectionName]

  if (!result) {
    throw new Error(
      `Could not find valid reasons for collection "${collectionName}"`,
    )
  }

  const withCommon = commonReasons.concat(result)

  return withCommon
}

export interface Report extends Record<string, any> {
  id: string
  parenttable: string
  parentid: string
  reason: string
  comments: string
  lastmodifiedat: string | null // Date
  lastmodifiedby: string | null
  createdat: string // Date
  createdby: string
}

export { ResolutionStatus }

export interface ReportsMeta extends Record<string, unknown> {
  assignedto: string | null
  modnotes: string | null
  resolutionstatus: ResolutionStatus
  resolutionnotes: string | null
}

export interface FullReport<TParent = any> extends Report, ReportsMeta {
  parentdata: TParent
  createdbyusername: string
  createdbyavatarurl: string
  lastmodifiedbyusername: string
  lastmodifiedbyavatarurl: string
  resolvedbyusername: string
  resolvedbyavatarurl: string
  assignedtousername: string
  assignedtoavatarurl: string
}

export enum CollectionNames {
  Reports = 'reports',
  ReportsMeta = 'reportsmeta',
}

export enum ViewNames {
  GetFullReports = 'getfullreports',
}
