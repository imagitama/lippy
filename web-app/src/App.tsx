import React, { lazy, Suspense, useEffect } from 'react'
import {
  Route,
  Switch,
  useLocation,
  useHistory,
  Redirect,
} from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useHead } from '@unhead/react'
import { Club as ClubIcon, Event as EventIcon } from '@/icons'

import * as routes from './routes'

// Do not lazy load these routes as they are very popular so they should load fast
import Home from './containers/home'
import Login from './containers/login'
import SignUp from './containers/signup'
import Logout from './containers/logout'
import ErrorContainer from './containers/error'
import ViewUser from './containers/view-user'
import Users from './containers/users'

import Header from './components/header'
import Footer from './components/footer'
import Notices from './components/notices'
import ErrorBoundary from './components/error-boundary'
import LoadingIndicator from './components/loading-indicator'
import BannedNotice from './components/banned-notice'

import {
  mediaQueryForMobiles,
  mediaQueryForTabletsOrBelow,
  mediaQueryForTabletsOrAbove,
} from './media-queries'
import useUserRecord from './hooks/useUserRecord'
import AccountVerificationMessage from './components/account-verification-message'
import { BUSINESS_DESC, BUSINESS_NAME, DEFAULT_PAGE_DESC } from './config'
import { loadSecondary, Secondary } from './secondary-loader'
import useStorage from './hooks/useStorage'
import Dialog from './components/dialog'
import Heading from './components/heading'
import BodyText from './components/body-text'
import FormControls from './components/form-controls'
import Button from './components/button'
import Link from './components/link'

const cache = new Map<string, React.ComponentType<any>>()

export const Lazy = new Proxy(
  {} as { [K in keyof Secondary]: React.ComponentType<any> },
  {
    get: (_, name: string) => {
      if (!cache.has(name)) {
        cache.set(
          name,
          lazy(async () => ({
            default: (await loadSecondary())[
              name as keyof Secondary
            ] as React.ComponentType<any>,
          }))
        )
      }
      return cache.get(name)
    },
  }
)

const useStyles = makeStyles({
  mainContainer: {
    height: '100%', // ensure timeline fits
    padding: '0 0.5rem',
    [mediaQueryForTabletsOrBelow]: {
      maxWidth: '100vw',
    },
    [mediaQueryForMobiles]: {
      padding: '0 0.25rem',
    },
  },
  homeNotices: {
    padding: '2rem',
  },
  homepage: {
    [mediaQueryForTabletsOrAbove]: {
      top: '37%',
    },
  },
  floatingLoadingIndicator: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-25%, -25%)',
    padding: '2rem',
    background: 'rgba(0, 0, 0, 0.25)',
    zIndex: 999,
  },
})

const useSetupProfileRedirect = () => {
  const [, , user] = useUserRecord()
  const { push } = useHistory()
  const location = useLocation()

  useEffect(() => {
    // username will be "null" if not created yet
    if (user && !user.username) {
      push(routes.setupProfile)
    }
  }, [user ? user.username !== null : null, location.pathname])
}

const items = [
  'Reticulating splines...',
  // 'Sharpening our spears...',
  'Loading...',
  'Loading...',
  'Loading...',
]
const getLoadingNiceness = () => {
  return items[Math.floor(Math.random() * items.length)]
}

const WelcomeMessage = () => {
  const [isHidden, setIsHidden] = useStorage<boolean>(
    'welcome-message-hidden',
    false
  )
  if (isHidden) return null
  return (
    <Dialog onClose={() => setIsHidden(true)}>
      <Heading variant="h2" noTopMargin>
        What is this?
      </Heading>
      <BodyText>
        <strong>
          A VRChat world that represents live music events as physical buildings
          on a street.
        </strong>
      </BodyText>
      <Heading variant="h2">Who made it?</Heading>
      <BodyText>
        My name is PeanutBuddha and I've been on VRChat for 8 years, created{' '}
        <Link to="https://www.vrcarena.com/">VRCArena</Link> 5 years ago and I
        love dnb/techno. I wanted to find live events in-game not from a
        website.
      </BodyText>
      <BodyText>
        <em>
          Until more clubs are added, I am manually importing events from other
          websites.
        </em>
      </BodyText>
      <BodyText>
        The VRChat world and website was <strong>not</strong> vibe coded. See
        our{' '}
        <Link to={routes.aiPolicy} onClick={() => setIsHidden(true)}>
          AI Policy
        </Link>
        .
      </BodyText>
      <Heading variant="h2">
        <ClubIcon /> Club Owners
      </Heading>
      <BodyText>
        VRChat group owners can create clubs. Import your club by signing up,
        linking your VRChat account and selecting a group you are the owner of.
      </BodyText>
      <BodyText>
        Event organizers can create clubs on behalf of group owners only if they
        have a "management" role (not recommended).
      </BodyText>
      <Heading variant="h2">
        <EventIcon /> Event Organizers
      </Heading>
      <BodyText>
        If a VRChat group owner has created the club, they can pick which roles
        can create/edit events (or assign users manually).
      </BodyText>
      <BodyText>
        If you can't ask the owner to create the club you can do it on their
        behalf (if you have a "management" role). Your options will be more
        limited.
      </BodyText>
      {/* <Heading variant="h2">
        <PerformerIcon /> Event Performers
      </Heading>
      <BodyText>
        Event organizers can either add you as a performer by name <em>or</em>{' '}
        you can create a performer profile which has a lot more customization.
      </BodyText> */}
      <FormControls>
        <Button onClick={() => setIsHidden(true)}>
          Okay - hide this forever
        </Button>
        <Button
          onClick={() => setIsHidden(true)}
          url={routes.about}
          color="secondary">
          Read More
        </Button>
      </FormControls>
    </Dialog>
  )
}

const MainContent = () => {
  useSetupProfileRedirect()
  return (
    <Suspense fallback={<LoadingIndicator message={getLoadingNiceness()} />}>
      {/* {!supabaseUserId ? (
        <div className={classes.floatingLoadingIndicator}>
          <LoadingIndicator message="Waiting for auth..." />
        </div>
      ) : null} */}
      <WelcomeMessage />
      <Switch>
        <Redirect from={'/guidelines'} to={routes.termsOfService} />
        <Redirect from={'/privacy-policy'} to={routes.privacyPolicy} />
        <Redirect from={'/dcma-policy'} to={routes.dmcaPolicy} />
        <Route exact path={routes.home} component={Home} />
        <Route exact path={routes.login} component={Login} />
        <Route exact path={routes.signUp} component={SignUp} />
        <Route exact path={routes.logout} component={Logout} />
        <Route path={routes.admin} component={Lazy.Admin} />
        <Route
          exact
          path={[
            routes.myAccountWithTabNameVarAndSubViewNameVarAndPageNumberVar,
            routes.myAccountWithTabNameVarAndSubViewNameVar,
            routes.myAccountWithTabNameVarAndPageNumberVar,
            routes.myAccountWithTabNameVar,
            routes.myAccount,
          ]}
          component={Lazy.MyAccount}
        />
        <Route
          exact
          path={[routes.attachments, routes.attachmentsWithPageNumberVar]}
          component={Lazy.Attachments}
        />
        <Route
          exact
          path={routes.editAttachmentWithVar}
          component={Lazy.EditAttachment}
        />
        <Route exact path={routes.editUserWithVar} component={Lazy.EditUser} />
        <Route exact path={routes.staffUsers} component={Users} />
        <Route
          exact
          path={routes.viewUsersWithPageNumberVar}
          component={Users}
        />
        <Route
          exact
          path={[routes.viewUserWithVar, routes.viewUserWithVarAndTabVar]}
          component={ViewUser}
        />
        <Route exact path={routes.users} component={Users} />
        {/* clubs */}
        <Route
          exact
          path={[routes.clubs, routes.viewClubsWithPageNumberVar]}
          component={Lazy.Clubs}
        />
        <Route
          exact
          path={[routes.createClub, routes.editClubWithVar]}
          component={Lazy.EditClub}
        />
        <Route
          exact
          path={[routes.viewClubWithVar]}
          component={Lazy.ViewClub}
        />
        {/* performers */}
        <Route
          exact
          path={[routes.performers, routes.viewPerformersWithPageNumberVar]}
          component={Lazy.Performers}
        />
        <Route
          exact
          path={[routes.createPerformer, routes.editPerformerWithVar]}
          component={Lazy.EditPerformer}
        />
        <Route
          exact
          path={[routes.viewPerformerWithVar]}
          component={Lazy.ViewPerformer}
        />
        {/* account */}
        <Route exact path={routes.patreon} component={Lazy.Patreon} />
        <Route exact path={routes.setupProfile} component={Lazy.SetupProfile} />
        <Route
          exact
          path={routes.resetPassword}
          component={Lazy.ResetPassword}
        />
        {/* tags */}
        <Route
          exact
          path={[routes.createTag, routes.editTagWithVar]}
          component={Lazy.EditTag}
        />
        <Route
          exact
          path={[routes.viewTagWithPageNumberVar, routes.viewTagWithVar]}
          component={Lazy.ViewTag}
        />
        <Route exact path={routes.tags} component={Lazy.Tags} />
        {/* reports */}
        <Route
          exact
          path={routes.createReportWithVar}
          component={Lazy.CreateReport}
        />
        <Route
          exact
          path={routes.viewReportWithVar}
          component={Lazy.ViewReport}
        />
        {/* support tickets */}
        <Route
          exact
          path={[routes.createSupportTicketWithVar, routes.createSupportTicket]}
          component={Lazy.CreateSupportTicket}
        />
        <Route
          exact
          path={routes.viewSupportTicketWithVar}
          component={Lazy.ViewSupportTicket}
        />
        <Route exact path={routes.world} component={Lazy.World} />
        <Route exact path={routes.dmcaPolicy} component={Lazy.DmcaPolicy} />
        <Route exact path={routes.brand} component={Lazy.Brand} />
        {/* events */}
        <Route
          exact
          path={[routes.editEventWithVar, routes.createEvent]}
          component={Lazy.EditEvent}
        />
        <Route
          exact
          path={routes.viewEventWithVar}
          component={Lazy.ViewEvent}
        />
        <Route exact path={routes.events} component={Lazy.Events} />
        <Route exact path={'/dev'} component={Lazy.Dev} />
        <Route exact path={routes.vrchat} component={Lazy.Vrchat} />
        <Route exact path={routes.importer} component={Lazy.Importer} />
        {/* pages - these must always be at the end as catch all */}
        <Route
          exact
          path={[
            routes.editPageWithPageVar,
            routes.editPageWithParentAndPageVar,
            routes.createPageWithPageVar,
            routes.createPageWithParentAndPageVar,
          ]}
          component={Lazy.EditPage}
        />
        <Route
          exact
          path={[routes.pagesWithParentVar, routes.pagesWithParentAndPageVar]}
          component={Lazy.Pages}
        />
        <Route
          component={() => (
            <ErrorContainer code={404} message="Page not found" />
          )}
        />
      </Switch>
    </Suspense>
  )
}

export default () => {
  const classes = useStyles()
  useHead({
    titleTemplate: (title) =>
      `${title || DEFAULT_PAGE_DESC} | ${BUSINESS_NAME} | ${BUSINESS_DESC}`,
  })
  return (
    <ErrorBoundary>
      <CssBaseline />
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <main className="main">
        <div className={classes.mainContainer}>
          <ErrorBoundary>
            <BannedNotice />
            <Notices />
            <AccountVerificationMessage />
            {/* <EditorQueueMessage /> */}
          </ErrorBoundary>
          <ErrorBoundary>
            <MainContent />
          </ErrorBoundary>
        </div>
      </main>
      <Footer />
    </ErrorBoundary>
  )
}
