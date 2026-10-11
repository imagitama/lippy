import type { AccessStatus, ApprovalStatus, SocialFields } from './common.ts'

export interface PerformerFields extends Record<string, any>, SocialFields {
  name: string
  description: string
  websiteurl: string
  email: string
}

export interface Performer extends PerformerFields {
  id: string
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

export interface PerformerMeta {
  id: string
  approvalstatus: ApprovalStatus
  accessstatus: AccessStatus
  modnotes: string | null
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

export interface FullPerformer extends PerformerMeta, Performer {
  lastmodifiedbyusername: string
  lastmodifiedbyavatarurl: string
  createdbyusername: string
  createdbyavatarurl: string
}

export interface PerformerForList extends FullPerformer {}

export enum CollectionNames {
  Performers = 'performers',
  PerformersMeta = 'performersmeta',
}

export enum ViewNames {
  GetFullPerformers = 'getfullperformers',
  GetPublicPerformers = 'getpublicperformers',
  GetPerformersForList = 'getperformersforlist',
  GetMyPerformers = 'getmyperformers',
}

export enum BucketNames {
  PerformerThumbnails = 'performer-thumbnails',
  PerformerBanners = 'performer-banners',
}
