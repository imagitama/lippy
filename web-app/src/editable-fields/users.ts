import { fieldTypes } from '@/generic-forms'
import { AVATAR_HEIGHT, AVATAR_WIDTH } from '@/config'
import { BucketNames, User } from 'shared/modules/users'
import type { EditableField } from './'

const fields: EditableField<User>[] = [
  {
    name: 'username',
    label: 'Username',
    type: fieldTypes.text,
    isRequired: true,
  },
  {
    name: 'avatarurl',
    label: 'Avatar image URL',
    type: fieldTypes.imageUpload,
    requiredWidth: AVATAR_WIDTH,
    requiredHeight: AVATAR_HEIGHT,
    bucketName: BucketNames.UserAvatars,
    default: '',
  },
  {
    name: 'bio',
    label: 'Bio',
    type: fieldTypes.textMarkdown,
  },
  {
    name: 'vrchatusername',
    label: 'VRChat username',
    type: fieldTypes.text,
  },
]

export default fields
