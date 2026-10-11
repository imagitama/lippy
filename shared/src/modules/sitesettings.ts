export interface SiteSettings<T> extends Record<string, any> {
  id: string
  value: T
  lastmodifiednotes: string | null
  lastmodifiedat: string | null // date
  lastmodifiedby: string | null
}

export enum CollectionNames {
  SiteSettings = 'sitesettings',
}
