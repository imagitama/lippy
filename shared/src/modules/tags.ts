import type { AccessStatus } from './common.ts'

export interface TagFields extends Record<string, unknown> {
  label: string
  category: string
  description: string
  isadult: boolean
  oppositetag: string
  icon: string // svg
}

export interface Tag extends TagFields {
  id: string // tag itself
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string | null // can be null - system
}

export interface TagMeta {
  id: string
  embedding: number[] | null
  modnotes: string | null
  accessstatus: AccessStatus
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string | null // can be null - system
}

export interface TagStats {
  tag: string
  count: number
}

export interface FullTag extends Tag, TagMeta, TagStats {}

export enum CollectionNames {
  Tags = 'tags',
  TagsMeta = 'tagsmeta',
}

export enum ViewNames {
  GetFullTags = 'getfulltags',
}
