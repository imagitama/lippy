import { fieldTypes } from '@/generic-forms'
import { THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT } from '@/config'
import type { EditableField } from './'
import { type Performer, BucketNames } from 'shared/modules/performers'
import { socialEditableFields } from './common'

export enum SectionNames {
  Basic = 'Basic',
  Promo = 'Promo',
  Social = 'Social',
  Commissions = 'Commissions',
  Sales = 'Sales',
}

const fields: EditableField<Performer>[] = [
  {
    name: 'name',
    label: 'Name',
    type: fieldTypes.text,
    isRequired: true,
    section: SectionNames.Basic,
  },
  {
    name: 'description',
    label: 'Description',
    type: fieldTypes.textMarkdown,
    default: '',
    section: SectionNames.Basic,
    hint: 'Explain a little about the club.',
  },
  {
    name: 'thumbnailurl',
    label: 'Thumbnail',
    type: fieldTypes.imageUpload,
    requiredWidth: THUMBNAIL_WIDTH,
    requiredHeight: THUMBNAIL_HEIGHT,
    bucketName: BucketNames.PerformerThumbnails,
    default: '',
    section: SectionNames.Basic,
  },
  {
    name: 'websiteurl',
    label: 'Website URL',
    type: fieldTypes.text,
    default: '',
    section: SectionNames.Basic,
  },
  {
    name: 'email',
    label: 'Email',
    type: fieldTypes.text,
    default: '',
    hint: 'Warning: Bots can find this URL so your spam inbox might get spammed!',
    section: SectionNames.Basic,
  },
  ...socialEditableFields,
]

export default fields
