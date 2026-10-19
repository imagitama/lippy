export interface VrchatWorldCachedItem {
  id: string
  world: VrchatWorld
}

export interface VrchatWorld {
  id: string
  imageUrl: string
  authorId: string
  authorName: string
  capacity: number
  created_at: string
  description: string
  favorites: number
  featured: boolean
  heat: number
  instances: any[]
  labsPublicationDate: string
  name: string
  namespace: string
  occupants: number
  organization: 'vrchat'
  popularity: number
  previewYoutubeId: string
  privateOccupants: number
  publicOccupants: number
  publicationDate: string
  releaseStatus: 'public'
  tags: string[]
  thumbnailImageUrl: string
  unityPackages: any[]
  updated_at: string
  version: number
  visits: number
}

export interface UnityPackage {
  platform: 'android' | 'standalonewindows'
}

export interface VrchatAvatar {
  id: string
  imageUrl: string
  name: string
  authorName: string
  created_at: string
  updated_at: string
  description: string
  release_status: string
  unityPackages: UnityPackage[]
}

export interface VrchatAvatarCachedItem {
  id: string // VRChat ID
  avatar: VrchatAvatar
  thumbnailurl: string | null // converted to webp on our servers TODO: do this
  fetchedat: string // date
}

export interface VrchatUser {
  id: string
  displayName: string
  statusDescription: string
}

export interface VrchatUserCachedItem {
  id: string // VRChat ID
  user: VrchatUser
  thumbnailurl: string | null // converted to webp on our servers TODO: do this
  fetchedat: string // date
}

// API returns data very similar to the actual group
export interface VrchatGroupMembership {
  bannerId: string | null
  bannerUrl: string | null
  description: string
  discriminator: string
  groupId: string
  iconId: string | null
  iconUrl: string | null
  id: string
  isRepresenting: boolean
  memberCount: number
  memberVisibility: string
  mutualGroup: boolean
  name: string
  nameplateId: string | null
  nameplateUrl: string | null
  ownerId: string
  privacy: string
  shortCode: string
}

export interface VrchatGroup extends Omit<VrchatGroupMembership, 'groupId'> {}

export interface VrchatGroupCachedItem {
  id: string // VRChat ID
  group: VrchatGroup | VrchatGroupMembership
  otherdata: {
    // not in use
    ownerIds: string[]
    otherStaffIds: string[]
  } | null
  thumbnailurl: string | null // converted to webp on our servers TODO: do this
  fetchedat: string // date
}

export type VrchatPlatform =
  'standalonewindows' | 'android' | 'ios' | (string & {})

export type VrchatInstanceType =
  'public' | 'hidden' | 'friends' | 'private' | 'group' | (string & {})

export type VrchatGroupAccessType =
  'members' | 'plus' | 'public' | (string & {})

// export interface VrchatContentSettings {
//   drones?: boolean;
//   emoji?: boolean;
//   pedestals?: boolean;
//   prints?: boolean;
//   props?: boolean;
//   stickers?: boolean;
// }

// export interface VrchatUnityPackage {
//   assetUrl?: string;
//   assetUrlObject?: Record<string, unknown>;
//   assetVersion: number;
//   created_at?: string;
//   id: string;
//   impostorUrl?: string;
//   impostorizerVersion?: string;
//   performanceRating?: string;
//   platform: VrchatPlatform;
//   pluginUrl?: string;
//   pluginUrlObject?: Record<string, unknown>;
//   scanStatus?: string;
//   unitySortNumber?: number;
//   unityVersion: string;
//   variant?: string;
//   worldSignature?: string;
// }

// export interface VrchatInstanceUser {
//   ageVerificationStatus?: string;
//   ageVerified?: boolean;
//   allowAvatarCopying?: boolean;
//   bio?: string;
//   bioLinks?: string[];
//   currentAvatarImageUrl?: string;
//   currentAvatarTags?: string[];
//   currentAvatarThumbnailImageUrl?: string;
//   date_joined?: string;
//   developerType?: string;
//   displayName: string;
//   friendKey?: string;
//   id: string;
//   imageUrl?: string;
//   isFriend?: boolean;
//   last_activity?: string;
//   last_mobile?: string | null;
//   last_platform?: VrchatPlatform;
//   platform?: VrchatPlatform;
//   profilePicOverride?: string;
//   profilePicOverrideThumbnail?: string;
//   pronouns?: string;
//   state?: string;
//   status?: string;
//   statusDescription?: string;
//   tags?: string[];
//   userIcon?: string;
// }

export interface VrchatInstance {
  active: boolean
  ageGate?: boolean
  calendarEntryId?: string | null
  canRequestInvite?: boolean
  capacity: number
  categoryId?: string
  clientNumber?: string
  closedAt?: string | null
  // contentSettings?: VrchatContentSettings
  creationLanguages?: string[]
  creatorId?: string
  description?: string
  disabledPropAbilities?: string[]
  displayName?: string | null
  displayVibeId?: string
  dominantLanguage?: string
  /** Owner user ID when type is "friends" */
  friends?: string
  full: boolean
  gameServerVersion?: number
  groupAccessType?: VrchatGroupAccessType
  hardClose?: boolean | null
  hasCapacityForYou?: boolean
  /** Owner user ID when type is "hidden" (friends+) */
  hidden?: string
  id: string
  instanceId: string
  instancePersistenceEnabled?: boolean | null
  languageRatio?: Record<string, number>
  languages?: string[]
  languagesIso639?: string[]
  location: string
  minimumAvatarPerformance?: string
  n_users: number
  name: string
  nonce?: string
  ownerId?: string
  permanent: boolean
  photonRegion: string
  platforms: Partial<Record<VrchatPlatform, number>>
  playerPersistenceEnabled?: boolean | null
  /** Owner user ID when type is "private" (invite) */
  private?: string
  queueEnabled: boolean
  queueSize: number
  recommendedCapacity: number
  region: string
  roleRestricted?: boolean
  secureName: string
  shortName?: string
  strict: boolean
  tags: string[]
  type: VrchatInstanceType
  userCount: number
  userIcons?: string[]
  // users?: VrchatInstanceUser[];
  vibeIds?: string[]
  world: VrchatWorld
  worldId: string
}

export interface VrchatInstanceCachedItem {
  id: string // VRChat ID
  instance: VrchatInstance
  thumbnailurl: string | null // converted to webp on our servers TODO: do this
  fetchedat: string // date
}

export interface VrchatGroupMemberUser {
  id: string
  displayName: string
  bannerColor?: string
  bannerType?: string
  bannerUrl?: string
  iconFrame?: string
  iconUrl?: string
  nameplateEffect?: string
  profileEffect?: string
}

export interface VrchatGroupMember {
  id: string
  userId: string
  user?: VrchatGroupMemberUser
  roleIds: string[]
}

export interface VrchatGroupRole {
  createdAt: string // ISO 8601
  defaultRole: boolean
  description: string
  groupId: string // grp_...
  id: string // grol_...
  isAddedOnJoin: boolean
  isManagementRole: boolean
  isSelfAssignable: boolean
  name: string
  order: number
  permissions: string[] // e.g. ["*"] for super admin
  productId?: string | null // prod_...
  requiresPurchase: boolean
  requiresTwoFactor: boolean
  updatedAt: string // ISO 8601
}

export enum CollectionNames {
  VrchatAvatarsCache = 'vrchatavatarscache',
  VrchatUsersCache = 'vrchatuserscache',
  VrchatGroupsCache = 'vrchatgroupscache',
  VrchatInstancesCache = 'vrchatinstancescache',
}

export enum BucketNames {
  VrchatCache = 'vrchat-cache',
}
