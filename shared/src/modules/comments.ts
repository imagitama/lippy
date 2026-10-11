import type { AccessStatus } from './common.ts'

export interface CommentFields extends Record<string, any> {
  comment: string
  parenttable: string
  parentid: string
}

export interface Comment extends CommentFields {
  id: string
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

export enum SuspicionReason {
  LongLength = 'long_length',
  WeirdChars = 'weird_chars',
  SameAsLast = 'same_as_last',
  // TODO: if contains URL
}

export interface CommentMeta {
  accessstatus: AccessStatus
  modnotes: string | null
  // suspicionamount: number | null
  // suspicionreason: SuspicionReason | null
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

export interface FullComment extends Comment, CommentMeta {
  createdbyusername: string
  createdbyavatarurl: string
  createdbyrole: string
  mentions: string[]
}

export enum CollectionNames {
  Comments = 'comments',
  CommentsMeta = 'commentsmeta',
}

export enum ViewNames {
  GetPublicComments = 'getpubliccomments',
  GetFullComments = 'getfullcomments',
}
