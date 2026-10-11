import type { DiscordEmbed } from '../discord.ts'
import type { QueuedItemFailureInfo } from '../queues.ts'
import { QueueStatus as DiscordMessageQueuedItemStatus } from './common.ts'

export { DiscordMessageQueuedItemStatus }

export interface DiscordMessageQueuedItem extends Record<string, any> {
  id: string // uuidv4
  target: string
  message: string
  embeds: DiscordEmbed[] | null
  status: DiscordMessageQueuedItemStatus
  notes: string | null // auto-cleared on status change
  failureinfo: QueuedItemFailureInfo<any> | null // auto-cleared on status change
  lastmodifiedat: string | null // date
  lastmodifiedby: string | null
  createdat: string // date
  createdby: string | null
}

export enum CollectionNames {
  DiscordMessageQueue = 'discordmessagequeue',
}
