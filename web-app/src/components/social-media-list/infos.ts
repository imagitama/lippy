import { SocialFields } from 'shared/modules/common'

interface SocialInfo {
  name: keyof SocialFields
  label: string
  icon?: null | React.ReactElement
  getUrl?: (val: string) => string
}

// strips leading @ and whitespace from usernames
const clean = (val: string) => val.trim().replace(/^@/, '')

const ensureUrl = (val: string) => {
  const v = val.trim()
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}

const socialInfo: SocialInfo[] = [
  // vrc
  {
    name: 'vrchatusername',
    label: 'VRChat',
    icon: null,
    // display names have no URL, so no getUrl
  },
  {
    name: 'vrchatuserid',
    label: 'VRChat Profile',
    icon: null,
    getUrl: (val) => `https://vrchat.com/home/user/${val.trim()}`,
  },
  {
    name: 'vrchatgroupid',
    label: 'VRChat Group',
    icon: null,
    getUrl: (val) => `https://vrchat.com/home/group/${val.trim()}`,
  },

  // other platforms
  {
    name: 'vrcdjusername',
    label: 'VRCDJ',
    icon: null,
  },

  // music focused
  {
    name: 'soundcloudusername',
    label: 'SoundCloud',
    icon: null,
    getUrl: (val) => `https://soundcloud.com/${clean(val)}`,
  },
  {
    name: 'bandcampurl',
    label: 'Bandcamp',
    icon: null,
    getUrl: ensureUrl,
  },
  {
    name: 'mixcloudurl',
    label: 'Mixcloud',
    icon: null,
    getUrl: ensureUrl,
  },

  // donation
  {
    name: 'kofiusername',
    label: 'Ko-fi',
    icon: null,
    getUrl: (val) => `https://ko-fi.com/${clean(val)}`,
  },

  // basic socials
  {
    name: 'youtubeusername',
    label: 'YouTube',
    icon: null,
    getUrl: (val) => `https://youtube.com/@${clean(val)}`,
  },
  {
    name: 'instagramusername',
    label: 'Instagram',
    icon: null,
    getUrl: (val) => `https://instagram.com/${clean(val)}`,
  },
  {
    name: 'twitterusername',
    label: 'Twitter / X',
    icon: null,
    getUrl: (val) => `https://x.com/${clean(val)}`,
  },
  {
    name: 'blueskyusername',
    label: 'Bluesky',
    icon: null,
    getUrl: (val) => `https://bsky.app/profile/${clean(val)}`,
  },
  {
    name: 'twitchusername',
    label: 'Twitch',
    icon: null,
    getUrl: (val) => `https://twitch.tv/${clean(val)}`,
  },
]

export default socialInfo
