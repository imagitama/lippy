import { fieldTypes } from '@/generic-forms'
import { THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT } from '@/config'
import type { CustomEditableField, EditableField } from './'
import { type Club, BucketNames } from 'shared/modules/clubs'
import { socialEditableFields } from './common'
import ClubPermissionsEditor from '@/components/club-permissions-editor'

export enum SectionNames {
  Basic = 'Basic',
  Perms = 'Perms',
}

const test: CustomEditableField<Club> = {
  type: fieldTypes.custom,
  name: 'owneruserids',
  renderer: ({ value, onChange }) => (
    <ClubPermissionsEditor value={value || []} onChange={onChange} />
  ),
}

const fields: EditableField<Club>[] = [
  {
    name: 'vrchatgroupid',
    label: 'VRChat Group ID',
    type: fieldTypes.text,
    isEditable: false,
    section: SectionNames.Basic,
  },
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
    bucketName: BucketNames.ClubThumbnails,
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
  {
    name: 'owneruserids',
    label: 'Club Owners',
    type: fieldTypes.custom,
    renderer: ({ value, onChange }) => (
      <ClubPermissionsEditor value={value || []} onChange={onChange} />
    ),
    default: [],
    hint: `Users on this site who can edit the club (and create/manage events). The creator of the club can always edit it.
  
Note: We can only automatically retrieve the VRChat group owner.`,
    section: SectionNames.Perms,
  } as CustomEditableField<Club, 'owneruserids'>,
  {
    name: 'moduserids',
    label: 'Club Moderators',
    type: fieldTypes.custom,
    renderer: ({ value, onChange }) => (
      <ClubPermissionsEditor value={value || []} onChange={onChange} />
    ),
    default: [],
    hint: `Users on this site who can create/manage events.
    
Note: We can only automatically retrieve the VRChat group owner.`,
    section: SectionNames.Perms,
  } as CustomEditableField<Club, 'moduserids'>,
  ...socialEditableFields,
]

export default fields
