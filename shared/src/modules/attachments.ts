import { AccessStatus, ApprovalStatus } from './common.ts'

export enum AttachmentReason {
  // AssetFile = 'asset-file',
  UserAdded = 'user-added',
}

export enum AttachmentType {
  Image = 'image',
  Url = 'url',
  File = 'file',
}

export interface AttachmentFields extends Record<string, unknown> {
  parenttable: string | null
  parentid: string | null
  reason: AttachmentReason
  url: string
  type: AttachmentType | null
  thumbnailurl: string
  title: string
  description: string
  license: string | null
  isadult: boolean | null
  tags: string[]
}

export interface Attachment extends AttachmentFields {
  id: string
  lastmodifiedby: string | null
  lastmodifiedat: string | null
  createdby: string
  createdat: string
}

export interface AttachmentMeta extends Record<string, unknown> {
  id: string
  approvalstatus: ApprovalStatus
  accessstatus: AccessStatus
  modnotes: string | null
  lastmodifiedat: string | null // date
  lastmodifiedby: string | null
  createdat: string // date
  createdby: string
}

export interface FullAttachment extends Attachment, AttachmentMeta {
  createdbyusername: string
  lastmodifiedbyusername: string
  modnotes: string | null
}

export enum AttachmentTypes {
  Image = 'image',
  Url = 'url',
}

export enum AttachmentSubTypes {
  Screenshot = 'screenshot',
  Meme = 'meme',
  Recording = 'recording',
  News = 'news',
}

export enum BucketNames {
  Attachments = 'attachments',
  AttachmentThumbnails = 'attachment-thumbnails',
}

export enum CollectionNames {
  Attachments = 'attachments',
}

export enum ViewNames {
  GetAttachmentsForList = 'getattachmentsforlist',
  GetFullAttachments = 'getfullattachments',
  GetPublicAttachments = 'getpublicattachments',
}

export const isFullAttachment = (thing: any): thing is FullAttachment =>
  thing && thing.createdbyusername
