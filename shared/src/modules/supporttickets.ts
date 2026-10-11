export enum SupportTicketCategory {
  // accounts
  CantEditAccount = 'cant-edit-account',
  LoginIssue = 'login-issue',
  CantLinkPatreon = 'cant-link-patreon',
  CantLinkVrchat = 'cant-link-vrchat',
  CantLinkDiscord = 'cant-link-discord',
  AccountVerificationIssue = 'account-verification-issue',
  OtherAccount = 'other-account',
  // technical
  Feedback = 'feedback',
  PageNotLoading = 'page-not-loading',
  OtherTechnical = 'other-technical',
}

export interface SupportTicketCategoryMeta {
  label: string
  description: string
  questions?: string[]
}

const imageText =
  'If an image please provide a link to the image you are trying to use (please upload it somewhere).'
const dateText = 'In format DD/MM/YYYY or similar'
const errorCodeQuestion =
  'What is the error code (if provided)? Either a single digit or a long string of letters, numbers and symbols'

export const supportTicketCategoryMeta: Record<
  SupportTicketCategory,
  SupportTicketCategoryMeta
> = {
  // accounts
  [SupportTicketCategory.CantEditAccount]: {
    label: "Can't Edit Account",
    description:
      'Unable to edit something with your account (eg. username, avatar, bio)',
    questions: [
      `What are you trying to edit? eg. your username. What are you changing it to? ${imageText}`,
      errorCodeQuestion,
    ],
  },
  [SupportTicketCategory.LoginIssue]: {
    label: 'Login Issue',
    description: 'Unable to login to one or more of your accounts',
    questions: [
      'If you have multiple accounts, what is the other account email or other unique ID? For example your Google email or Discord account',
    ],
  },
  [SupportTicketCategory.CantLinkPatreon]: {
    label: "Can't Link Patreon",
    description:
      'Unable to connect your Patreon account to your VRCArena account',
    questions: [
      'What is your Patreon user ID and username and email?',
      'What steps did you perform when you tried to link it? What failed?',
    ],
  },
  [SupportTicketCategory.CantLinkVrchat]: {
    label: "Can't Link VRChat",
    description: 'Unable to link your VRChat account to your VRCArena account',
    questions: [
      'What is your VRChat username?',
      'What steps did you perform when you tried to link it? What failed?',
    ],
  },
  [SupportTicketCategory.CantLinkDiscord]: {
    label: "Can't Link Discord",
    description: 'Unable to link your Discord account to your VRCArena account',
    questions: [
      'What is your Discord user ID, username and email?',
      'What steps did you perform when you tried to link it? What failed?',
    ],
  },
  [SupportTicketCategory.AccountVerificationIssue]: {
    label: 'Account Verification Issue',
    description:
      'Did not receive your verification email or clicking the link does nothing or you verified but the message still shows up',
    questions: ['Did you get the email? If not, did the site say it sent it?'],
  },
  [SupportTicketCategory.OtherAccount]: {
    label: 'Other Account Issue',
    description: 'Any other account-related issue',
  },
  // technical
  [SupportTicketCategory.Feedback]: {
    label: 'Feedback',
    description: 'Suggestions, comments, or general feedback',
  },
  [SupportTicketCategory.PageNotLoading]: {
    label: 'Page Not Loading',
    description:
      'A page or part of a page is not loading correctly and may show an error message',
    questions: [
      'Which page URL did you try and visit? eg. /my-account',
      'Which part of the page did not work? eg. when you click the login button it makes the error appear',
      errorCodeQuestion,
    ],
  },
  [SupportTicketCategory.OtherTechnical]: {
    label: 'Other Technical Issue',
    description: 'Any other technical problem not listed above',
  },
}

export interface SupportTicketAnswer {
  question: string
  answer: string
}

export interface SupportTicket extends Record<string, any> {
  id: string
  category: SupportTicketCategory
  answers: SupportTicketAnswer[]
  relatedtable: string
  relatedid: string
  comments: string
  lastmodifiedat: string | null // Date
  lastmodifiedby: string | null
  createdat: string // Date
  createdby: string
}

export enum ResolutionStatus {
  Pending = 'pending',
  Resolved = 'resolved',
}

export interface SupportTicketMeta extends Record<string, unknown> {
  modnotes: string | null
  assignedto: string | null
  resolutionstatus: ResolutionStatus
  resolutionnotes: string
}

export interface FullSupportTicket<TRelated = any>
  extends SupportTicket, SupportTicketMeta {
  relateddata: TRelated
  createdbyusername: string
  createdbyavatarurl: string
  lastmodifiedbyusername: string
  lastmodifiedbyavatarurl: string
  assignedtousername: string
  assignedtoavatarurl: string
  // TODO: add statuschanges
}

export enum CollectionNames {
  SupportTickets = 'supporttickets',
  SupportTicketsMeta = 'supportticketsmeta',
}

export enum ViewNames {
  GetFullSupportTickets = 'getfullsupporttickets',
}
