import {
  BanStatus,
  CoreUserFields,
  UserForList,
  UserRoles,
} from 'shared/modules/users'

export function getIsRoleAStaffMember(role: UserRoles): boolean {
  return role === UserRoles.Admin || role === UserRoles.Moderator
}

export function getUserIsStaffMember(
  user: CoreUserFields | UserForList
): boolean {
  return getIsRoleAStaffMember(user.role)
}

export const getIsUserBanned = (user: CoreUserFields | UserForList): boolean =>
  user.banstatus === BanStatus.Banned
