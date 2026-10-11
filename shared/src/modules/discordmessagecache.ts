import type { DiscordChannelMessage } from '../discord.ts'

// interface DiscordUser {
//   id: string
//   username: string
//   discriminator: string // 4 digit code
//   avatar?: string
//   bot?: boolean
//   system?: boolean
// }

export interface CachedDiscordMessage {
  id: string
  channelid: string
  content: string
  type: number
  sentat: Date
  authorid: string
  rawdata: DiscordChannelMessage
  cachedat: Date
}

export enum CollectionNames {
  DiscordMessageCache = 'discordmessagecache',
}
