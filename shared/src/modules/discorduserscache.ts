import type { ApiDiscordUser } from '../discord.ts'

export interface CachedDiscordUser {
  id: number // discord user ID
  fields: ApiDiscordUser
}

export enum CollectionNames {
  DiscordUsersCache = 'discordusers', // TODO: rename to "cache"
}
