import { OrderDirections } from './hooks/useDatabaseQuery'

export const commonFields: { [key: string]: any } = {
  createdat: 'createdat',
  title: 'title',
}

export const predefinedOptions: {
  [key: string]: { fieldName: any; direction: OrderDirections }
} = {
  'title asc': {
    fieldName: commonFields.title,
    direction: OrderDirections.ASC,
  },
  'title desc': {
    fieldName: commonFields.title,
    direction: OrderDirections.DESC,
  },
  'date asc': {
    fieldName: commonFields.createdAt,
    direction: OrderDirections.ASC,
  },
  'date desc': {
    fieldName: commonFields.createdAt,
    direction: OrderDirections.DESC,
  },
}
