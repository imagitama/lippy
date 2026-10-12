export enum FeaturedStatus {
  Featured = 'featured',
  Unfeatured = 'unfeatured',
}

export enum PublishStatus {
  Published = 'published',
  Draft = 'draft',
}

export enum AccessStatus {
  Public = 'public',
  Archived = 'archived',
  Deleted = 'deleted',
}

export enum ApprovalStatus {
  Approved = 'approved',
  Waiting = 'waiting',
  Declined = 'declined',
  AutoApproved = 'autoapproved',
  Quarantined = 'quarantined',
}

export enum PinnedStatus {
  Pinned = 'pinned',
  Unpinned = 'unpinned',
}

export enum QueueStatus {
  Queued = 'queued',
  Processing = 'processing',
  Processed = 'processed',
  Failed = 'failed',
}

export interface MetaRecord extends Record<string, unknown> {
  modnotes: string | null
  featuredstatus: FeaturedStatus
  accessstatus: AccessStatus
  approvalstatus: ApprovalStatus
  publishstatus: PublishStatus
}

export enum ResolutionStatus {
  Pending = 'pending',
  Resolved = 'resolved',
}

// clubs/performers
export interface SocialFields {
  // vrc
  vrchatusername: string | null
  vrchatuserid: string | null
  vrchatgroupid: string | null
  // other platforms
  vrcdjusername: string | null
  // music focused
  soundcloudusername: string | null
  bandcampurl: string | null
  mixcloudurl: string | null
  // donation
  kofiusername: string | null
  // basic socials
  youtubeusername: string | null
  instagramusername: string | null
  twitterusername: string | null
  blueskyusername: string | null
  twitchusername: string | null
}

export interface StatusChange {
  value: string
  userid: string | null
  username: string | null
  avatarurl: string | null
  createdat: string | null // date
  historyid: string
}

export type StatusChanges = {
  [columnName: string]: StatusChange
}
