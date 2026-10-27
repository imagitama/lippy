import { Club } from 'shared/modules/clubs'
import { FullEvent } from 'shared/modules/events'

export const getIsUserClubOwner = (
  userId: string,
  vrchatUserId: string | null,
  club: NonNullable<FullEvent['club']>
): boolean => {
  // console.debug(
  //   'getIsUserClubOwner',
  //   userId,
  //   vrchatUserId,
  //   club.vrchatowneruserids
  // )

  // 1. if they own the VRChat group itself
  if (club.vrchatownerid === vrchatUserId) return true

  // 2. if the VRChat group owner has specified Lippy users as co-owners
  if (club.owneruserids.includes(userId)) return true

  // 3. if the VRChat group owner has specified VRChat users as co-owners (by role or manually)
  if (vrchatUserId && club.vrchatowneruserids.includes(vrchatUserId))
    return true

  return false
}

export const getIsUserClubMod = (
  userId: string,
  vrchatUserId: string | null,
  club: NonNullable<FullEvent['club']>
): boolean => {
  // console.debug('getIsUserClubMod', userId, vrchatUserId, club.vrchatmoduserids)

  // 1. if the VRChat group owner has specified Lippy users as mods
  if (club.moduserids.includes(userId)) return true

  // 2. if the VRChat group owner has specified VRChat users as mods
  if (vrchatUserId && club.vrchatmoduserids.includes(vrchatUserId)) return true

  return false
}

export const getIsUserClubStaff = (
  userId: string,
  vrchatUserId: string | null,
  club: NonNullable<FullEvent['club']>
): boolean =>
  getIsUserClubOwner(userId, vrchatUserId, club) ||
  getIsUserClubMod(userId, vrchatUserId, club)
