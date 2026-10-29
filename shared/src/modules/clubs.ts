import type { SocialFields } from './common.ts'

export type ClubColor = [number, number, number]

export interface ClubFields extends Record<string, any>, SocialFields {
  vrchatgroupid: string | null // VRChat ID
  resonitegroupid: string | null
  chilloutvrgroupid: string | null
  name: string
  description: string | null
  thumbnailurl: string | null
  websiteurl: string | null
  email: string | null
  color: ClubColor | null
  owneruserids: string[] // our users who can edit the entire club
  moduserids: string[] // our users who can create/edit events
  vrchatownerroleids: string[] // VRC role IDs
  vrchatmodroleids: string[] // VRC role IDs
  vrchatowneruserids: string[] // VRC user IDs
  vrchatmoduserids: string[] // VRC user IDs
}

export interface Club extends ClubFields {
  id: string
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

export interface ClubMeta {
  id: string
  linkedvrchatgroupid: string // VRC group ID
  vrchatownerid: string // VRC user ID
  approvalstatus: string
  accessstatus: string
  modnotes: string | null
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

export interface FullClub extends ClubMeta, Club {
  lastmodifiedbyusername: string
  lastmodifiedbyavatarurl: string
  createdbyusername: string
  createdbyavatarurl: string
  vrchatownerid: string // VRChat user ID
  owneruserid: string | null // our ID
  ownerusername: string | null
}

export interface ClubForList extends FullClub {}

export enum CollectionNames {
  Clubs = 'clubs',
  ClubsMeta = 'clubsmeta',
}

export enum ViewNames {
  GetFullClubs = 'getfullclubs',
  GetPublicClubs = 'getpublicclubs',
  GetClubsForList = 'getclubsforlist',
  GetMyClubs = 'getmyclubs',
}

export enum BucketNames {
  ClubThumbnails = 'club-thumbnails',
  ClubBanners = 'club-banners',
}
