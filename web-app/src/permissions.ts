import { CommonRecordFields } from './data-store'
import { BanStatus, FullUser, User, UserRoles } from 'shared/modules/users'
import { routes } from './routes'

export const getHasPermissionForRecord = <TRecord extends CommonRecordFields>(
  user: FullUser | User | null,
  record: TRecord | null,
  allowEditingOwnRecord = false
): boolean => {
  if (user === null || record === null) {
    return false
  }

  if ('banstatus' in user && user.banstatus === BanStatus.Banned) {
    return false
  }

  if (
    'role' in user &&
    (user.role === UserRoles.Moderator || user.role === UserRoles.Admin)
  ) {
    return true
  }

  if (
    allowEditingOwnRecord &&
    record.createdby &&
    user.id === record.createdby
  ) {
    return true
  }

  return false
}

// TODO: Change routes to a more declarative thing instead of array:

// interface Route {
//   route: string
//   permissions: {
//     loggedIn: boolean
//     loggedOut: boolean
//     user: boolean
//     editor: boolean
//     admin: boolean
//   }
// }

const permissions = {
  [UserRoles.User]: [
    routes.home,
    // logged in stuff
    routes.logout,
    routes.logoutWithVar,
    routes.myAccount,
    routes.myAccountWithTabNameVar,
    routes.myAccountWithTabNameVarAndPageNumberVar,
    routes.resetPassword,
    routes.setupProfile,
    // pages
    routes.privacyPolicy,
    routes.termsOfService,
    routes.takedownPolicy,
    routes.stats,
    routes.about,
    routes.patreon,
    routes.dmcaPolicy,
    routes.brand,
    routes.transparency,
    // users
    routes.users,
    routes.viewUserWithVar,
    routes.viewUserWithVarAndTabVar,
    routes.staffUsers,
    routes.viewUsersWithPageNumberVar,
    // activity
    routes.activity,
    routes.activityWithPageNumberVar,
    routes.nsfw,
    routes.nsfwWithPageNumberVar,
    // clubs
    routes.clubs,
    routes.viewClubsWithPageNumberVar,
    routes.viewClubWithVar,
    routes.editClubWithVar,
    routes.createClub,
    // performers
    routes.performers,
    routes.viewPerformersWithPageNumberVar,
    routes.viewPerformerWithVar,
    routes.editPerformerWithVar,
    routes.createPerformer,
    // discord servers
    routes.viewDiscordServersWithPageNumberVar,
    routes.viewDiscordServerWithVar,
    // tags
    routes.tags,
    routes.viewTagWithPageNumberVar,
    routes.viewTagWithVar,
    // reports
    routes.createReportWithVar,
    routes.viewReportWithVar,
    // pages
    routes.pagesWithParentVar,
    routes.pagesWithParentAndPageVar,
    // events
    routes.events,
    routes.viewEventWithVar,
    routes.createEvent,
    routes.editEventWithVar,
    // attachments
    routes.attachments,
    routes.attachmentsWithPageNumberVar,
    routes.viewAttachmentWithVar,
    routes.editAttachmentWithVar,
    // tag suggestions
    routes.createTagSuggestion,
    // articles
    routes.createArticle,
  ],
  [UserRoles.Moderator]: [
    routes.admin,
    routes.adminWithTabNameVar,
    routes.adminWithTabNameVarAndPageNumberVar,
    routes.editUserWithVar,
    routes.editDiscordServerWithVar,
    routes.createDiscordServer,
    routes.createTag,
    routes.editTagWithVar,
    routes.editReportWithVar,
    routes.editPageWithParentAndPageVar,
    routes.createPageWithParentAndPageVar,
    routes.editAttachmentWithVar,
    routes.editArticleWithVar,
  ],
  [UserRoles.Admin]: [
    routes.admin,
    routes.adminWithTabNameVar,
    routes.adminWithTabNameVarAndPageNumberVar,
    routes.editUserWithVar,
    routes.editDiscordServerWithVar,
    routes.createDiscordServer,
    routes.createTag,
    routes.editTagWithVar,
    routes.editReportWithVar,
    routes.editPageWithParentAndPageVar,
    routes.createPageWithParentAndPageVar,
    routes.editAttachmentWithVar,
  ],
}

const guest = [routes.login, routes.loginWithVar]

export const getHasPermissionForRoute = (
  user: FullUser | User,
  route: string
): boolean => {
  if ('banstatus' in user && user.banstatus === BanStatus.Banned) {
    return false
  }

  if (
    'role' in user &&
    (user.role === UserRoles.Moderator || user.role === UserRoles.Admin)
  ) {
    return true
  }

  if (
    user.role &&
    (user.role as UserRoles) in permissions &&
    Object.values(permissions[user.role as UserRoles]).includes(route)
  ) {
    return true
  }

  if (!('role' in user) && guest.includes(route)) {
    return true
  }

  return false
}
