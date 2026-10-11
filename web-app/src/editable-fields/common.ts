import { fieldTypes } from '@/generic-forms'
import { EditableField } from '.'
import { SocialFields } from 'shared/modules/common'

enum SectionNames {
  Social = 'social',
}

export const socialEditableFields: EditableField<SocialFields>[] = [
  // vrc
  {
    name: 'vrchatusername',
    label: 'VRChat Username',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },
  {
    name: 'vrchatuserid',
    label: 'VRChat User ID',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
    hint: 'The ID itself eg. usr_08a2766d-95f3-4e4e-99c2-4c583c56daf6',
  },
  {
    name: 'vrchatgroupid',
    label: 'VRChat Group ID',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
    hint: 'The ID itself eg. grp_b27578ce-cc04-4087-b773-343f492fec08',
  },

  // other platforms
  {
    name: 'vrcdjusername',
    label: 'VRCDJ Username',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
    hint: 'Only the username eg. "vootech" from URL https://vrcdj.app/vootech',
  },

  // music focused
  {
    name: 'soundcloudusername',
    label: 'SoundCloud Username (without @)',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },
  {
    name: 'bandcampurl',
    label: 'Bandcamp URL',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },
  {
    name: 'mixcloudurl',
    label: 'Mixcloud URL',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },

  // donation
  {
    name: 'kofiusername',
    label: 'Ko-fi Username (without @)',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },

  // basic socials
  {
    name: 'youtubeusername',
    label: 'YouTube Username (without @)',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },
  {
    name: 'instagramusername',
    label: 'Instagram Username (without @)',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },
  {
    name: 'twitterusername',
    label: 'Twitter Username (without @)',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },
  {
    name: 'blueskyusername',
    label: 'Bluesky Handle (e.g. name.bsky.social)',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },
  {
    name: 'twitchusername',
    label: 'Twitch Username (without @)',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Social,
  },
]
