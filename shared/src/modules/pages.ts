export interface Page extends Record<string, unknown> {
  id: string
  parentid: string
  title: string
  description: string
  content: string
  lastmodifiedby: string | null
  lastmodifiedat: string | null
  createdby: string | null
  createdat: string
}

export enum CollectionNames {
  Pages = 'pages',
  PageParents = 'pageparents',
}
