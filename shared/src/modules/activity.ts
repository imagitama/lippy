export interface ActivityEntry {
  id: string
  message: string
  parenttable: string
  parentid: string
  data: { [collectionName: string]: string }
  createdat: string
  createdby: string
}

export interface FullActivityEntry extends ActivityEntry {
  parentdata: any
  moredata: { [collectionName: string]: any }
  createdbyusername: string
}
