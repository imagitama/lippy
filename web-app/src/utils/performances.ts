interface MetaFields {
  id: string
  lastmodifiedat: string | null
  lastmodifiedby: string | null
  createdat: string
  createdby: string
}

type MetaKey = keyof MetaFields

const META_KEYS: readonly MetaKey[] = [
  'id',
  'lastmodifiedat',
  'lastmodifiedby',
  'createdat',
  'createdby',
]

export function stripMetaFields<T extends object>(obj: T): Omit<T, MetaKey> {
  const copy = { ...obj } as Record<string, unknown>
  for (const key of META_KEYS) {
    delete copy[key]
  }
  return copy as Omit<T, MetaKey>
}
