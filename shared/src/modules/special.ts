export interface SpecialEntry<TValue> extends Record<string, any> {
  id: string // anything
  value: TValue | null // anything
  lastmodifiedat: string | null // date
  lastmodifiedby: string | null
}

export enum CollectionNames {
  Classified = 'classified',
  Special = 'special',
}

export interface ClassifiedEntry<TValue> extends Record<string, any> {
  id: string // anything
  value: TValue | null // anything
  lastmodifiedat: string // date
  lastmodifiedby: string
  createdat: string // date
  createdby: string
}

export enum ClassifiedIds {
  VRChatAuth = 'vrchatauth',
  VRChatApi = 'vrchatapi',
}
