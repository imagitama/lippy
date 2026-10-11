// these containers represent over 1mb of download and some users will never see them
// so tell ESBuild to split into another chunk

export { default as MyAccount } from './containers/my-account'
export { default as ResetPassword } from './containers/reset-password'
export { default as SetupProfile } from './containers/setup-profile'

export { default as Admin } from './containers/admin'

export { default as Tags } from './containers/tags'
export { default as EditTag } from './containers/edit-tag'
export { default as ViewTag } from './containers/view-tag'

export { default as Clubs } from './containers/clubs'
export { default as EditClub } from './containers/edit-club'
export { default as ViewClub } from './containers/view-club'

export { default as Performers } from './containers/performers'
export { default as EditPerformer } from './containers/edit-performer'
export { default as ViewPerformer } from './containers/view-performer'

export { default as EditUser } from './containers/edit-user'

export { default as Events } from './containers/events'
export { default as EditEvent } from './containers/edit-event'
export { default as ViewEvent } from './containers/view-event'

export { default as CreateReport } from './containers/create-report'
export { default as ViewReport } from './containers/view-report'

export { default as CreateSupportTicket } from './containers/create-support-ticket'
export { default as ViewSupportTicket } from './containers/view-support-ticket'

export { default as World } from './containers/world'
export { default as Patreon } from './containers/patreon'
export { default as DmcaPolicy } from './containers/dmca-policy'
export { default as Brand } from './containers/brand'
export { default as Dev } from './containers/dev'
export { default as Unsubscribe } from './containers/unsubscribe'

export { default as EditAttachment } from './containers/edit-attachment'
export { default as Attachments } from './containers/attachments'

export { default as Pages } from './containers/pages'
export { default as EditPage } from './containers/edit-page'

export { default as Vrchat } from './containers/vrchat'
