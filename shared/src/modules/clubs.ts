import type { SocialFields } from './common.ts'

export interface ClubFields extends Record<string, any>, SocialFields {
  vrchatgroupid: string | null // VRChat ID
  resonitegroupid: string | null
  chilloutvrgroupid: string | null
  name: string
  description: string | null
  thumbnailurl: string | null
  websiteurl: string | null
  email: string | null
  owneruserids: string[]
  moduserids: string[]
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
  linkedvrchatgroupid: string // linked VRChat ID
  // owneruserids: string[] // our user IDs
  // moduserids: string[] // our user IDs
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
