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

  if (club.createdby === userId) return true

  if (club.owneruserids.includes(userId)) return true

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

  if (club.moduserids.includes(userId)) return true

  if (vrchatUserId && club.vrchatmoduserids.includes(vrchatUserId)) return true

  return false
}

export const getIsUserClubStaff = (
  userId: string,
  vrchatUserId: string | null,
  club: Club
): boolean =>
  getIsUserClubOwner(userId, vrchatUserId, club) ||
  getIsUserClubMod(userId, vrchatUserId, club)
