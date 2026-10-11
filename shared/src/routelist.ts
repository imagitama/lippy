export const home = '/'
export const signUp = '/sign-up'
export const login = '/login'
export const loginWithVar = '/login?from=:currentPath'
export const logout = '/logout'
export const logoutWithVar = '/logout?from=:currentPath'
export const myAccount = '/my-account'
export const myAccountWithTabNameVar = '/my-account/:tabName'
export const myAccountWithTabNameVarAndPageNumberVar =
  '/my-account/:tabName/page/:pageNumber'
export const myAccountWithTabNameVarAndSubViewNameVar =
  '/my-account/:tabName/:subViewName'
export const myAccountWithTabNameVarAndSubViewNameVarAndPageNumberVar =
  '/my-account/:tabName/:subViewName/page/:pageNumber'
export const setupProfile = '/setup-profile'
export const resetPassword = '/reset-password'

// pages
export const privacyPolicy = '/help/privacy-policy'
export const aiPolicy = '/help/ai-policy'
export const termsOfService = '/help/terms-of-service'
export const takedownPolicy = '/help/takedown-policy'
export const about = '/about'
export const dmcaPolicy = '/dmca-policy'
export const brand = '/brand'
export const transparency = '/transparency'

export const users = '/users'
export const staffUsers = '/users/staff'
export const viewUserWithVar = '/users/:userId'
export const editUserWithVar = '/users/:userId/edit'
export const viewUserWithVarAndTabVar = '/users/:userId/:tabName'
export const viewUsersWithPageNumberVar = '/users/page/:pageNumber'

export const activity = '/activity'
export const activityWithPageNumberVar = '/activity/page/:pageNumber'

export const queue = '/queue'
export const stats = '/stats'
export const nsfw = '/nsfw'
export const nsfwWithPageNumberVar = '/nsfw/page/:pageNumber'

export const clubs = '/clubs'
export const viewClubsWithPageNumberVar = '/clubs/page/:pageNumber'
export const viewClubWithVar = '/clubs/:clubId'
export const editClubWithVar = '/clubs/:clubId/edit'
export const createClub = '/clubs/create'
export const createClubWithUrlVar = '/clubs/create?url=:url'

export const performers = '/performers'
export const viewPerformersWithPageNumberVar = '/performers/page/:pageNumber'
export const viewPerformerWithVar = '/performers/:performerId'
export const editPerformerWithVar = '/performers/:performerId/edit'
export const createPerformer = '/performers/create'

export const viewDiscordServersWithPageNumberVar =
  '/discord-servers/page/:pageNumber'
export const viewDiscordServerWithVar = '/discord-servers/:discordServerId'
export const editDiscordServerWithVar = '/discord-servers/:discordServerId/edit'
export const createDiscordServer = '/discord-servers/create'

export const tags = '/tags'
export const viewTagWithPageNumberVar = '/tags/:tag/page/:pageNumber'
export const viewTagWithVar = '/tags/:tag'
export const createTag = '/tags/create'
export const editTagWithVar = '/tags/:tag/edit'

export const createReportWithVar = '/reports/create/:parentTable/:parentId'
export const editReportWithVar = '/reports/edit/:reportId'
export const viewReportWithVar = '/reports/:reportId'

export const patreon = '/patreon'
export const world = '/world'

export const pagesWithParentVar = '/:parentName'
export const pagesWithParentAndPageVar = '/:parentName/:pageName'
export const editPageWithParentAndPageVar = '/:parentName/:pageName/edit'
export const editPageWithPageVar = '/:pageName/edit'
export const createPageWithPageVar = '/:pageName/create'
export const createPageWithParentAndPageVar = '/:parentName/:pageName/create'

export const events = '/events'
export const viewEventWithVar = '/events/:eventId'
export const createEvent = '/events/create'
export const createEventWithDateVar = '/events/create?date=:date'
export const createEventWithClubVar = '/events/create?club=:clubId'
export const editEventWithVar = '/events/:eventId/edit'

export const attachments = '/attachments'
export const attachmentsWithPageNumberVar = '/attachments/page/:pageNumber'
export const viewAttachmentWithVar = '/attachments/:attachmentId'
export const editAttachmentWithVar = '/attachments/:attachmentId/edit'

export const viewReviewWithVar = '/reviews/:reviewId'
export const editReviewWithVar = '/reviews/:reviewId/edit'
export const createReview = '/reviews/create'

export const createSupportTicket = '/support-tickets/create'
export const createSupportTicketWithVar =
  '/support-tickets/create/:parentTable/:parentId'
export const viewSupportTicketWithVar = '/support-tickets/:supportTicketId'

export const tagSuggestions = '/tag-suggestions'
export const tagSuggestionsWithPageNumberVar =
  '/tag-suggestions/page/:pageNumber'
export const viewTagSuggestionWithVar = '/tag-suggestions/:tagSuggestionId'
export const editTagSuggestionWithVar = '/tag-suggestions/:tagSuggestionId/edit'
export const createTagSuggestion = '/tag-suggestions/create'
export const createTagSuggestionWithVar = '/tag-suggestions/create?tag=:tagName'

export const articles = '/articles'
export const createArticle = '/articles/create'
export const createArticleWithVars =
  '/articles/create?parentTable=:parentTable&parentId=:parentId'
export const editArticleWithVar = '/articles/edit/:articleId'
export const viewArticleWithVar = '/articles/:articleId'
export const articlesWithPageNumberVar = '/articles/page/:pageNumber'

// admin - generic
export const admin = '/admin'
export const adminWithTabNameVar = '/admin/:tabName'
export const adminWithTabNameVarAndPageNumberVar =
  '/admin/:tabName/page/:pageNumber'
export const adminWithTabNameVarAndSubViewNameVar =
  '/admin/:tabName/:subViewName'
export const adminWithTabNameVarAndSubViewNameVarAndPageNumberVar =
  '/admin/:tabName/:subViewName/page/:pageNumber'

// admin - new sub-routes
export const adminWithTabNameVarAndSubRouteNameVar =
  '/admin/:tabName/:subRouteName'
export const adminWithTabNameVarAndSubRouteNameVarAndPageNumberVar =
  '/admin/:tabName/:subRouteName/page/:pageNumber'
export const adminWithTabNameVarAndSubRouteNameVarAndSubViewNameVar =
  '/admin/:tabName/:subRouteName/:subViewName'
export const adminWithTabNameVarAndSubRouteNameVarAndSubViewNameVarAndPageNumberVar =
  '/admin/:tabName/:subRouteName/:subViewName/page/:pageNumber'

// admin - specific
export const adminHistoryWithQueryParamVars =
  '/admin/history?userId=:userId&parentType=:parentType&parentId=:parentId'

export const vrchat = '/vrchat'
