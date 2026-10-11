import React, { useState } from 'react'
import { useLocation } from 'react-router'
import { makeStyles } from '@mui/styles'
import FlagIcon from '@mui/icons-material/Flag'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { handleError } from '@/error-handling'
import { trackAction } from '@/analytics'
import * as routes from '@/routes'
import { mediaQueryForMobiles } from '@/media-queries'
import { defaultNotificationPrefs, NotificationEvent } from '@/notifications'
import { CollectionNames, UserPreferences } from 'shared/modules/users'

import useUserRecord from '@/hooks/useUserRecord'
import useUserId from '@/hooks/useUserId'
import useDataStoreEdit from '@/hooks/useDataStoreEdit'

import ErrorMessage from '@/components/error-message'
import SuccessMessage from '@/components/success-message'
import LoadingIndicator from '@/components/loading-indicator'
import Button from '@/components/button'
import Heading from '@/components/heading'
import VrPlatformChooser from '@/components/vr-platform-chooser'
import CheckboxInput from '@/components/checkbox-input'
import FormControls from '@/components/form-controls'
import UsernameEditor from '@/components/username-editor'
import Tabs, { useTabs } from '@/components/tabs'

import { CONTENT_MAX_WIDTH_PX } from '@/config'
import AdultContentToggle from '../adult-content-toggle'
import BodyText from '../body-text'
import Link from '../link'

const useStyles = makeStyles({
  root: {
    margin: '2rem auto',
    textAlign: 'center',
    [mediaQueryForMobiles]: {
      width: '100%',
    },
  },
  input: {
    width: '100%',
    maxWidth: '500px',
  },
  checkboxRow: {
    textAlign: 'center',
  },
  finalStep: {
    width: '50%',
    margin: '0 auto',
    [mediaQueryForMobiles]: {
      width: '100%',
    },
  },
  digestInfo: {
    margin: '1rem 0 2rem',
    fontStyle: 'italic',
    fontSize: '80%',
  },
  tabPanel: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      width: '100%',
      maxWidth: `${CONTENT_MAX_WIDTH_PX}px`,
    },
  },
  formControls: {
    marginTop: '2rem',
  },
})

const TabPanel = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles()
  return (
    <div className={classes.tabPanel}>
      <div>{children}</div>
    </div>
  )
}

const TabControls = ({
  onFinish,
  isCreating,
}: {
  onFinish: () => void
  isCreating: boolean
}) => {
  const { count, activeTabIdx, back, next } = useTabs()
  const [, , user] = useUserRecord()
  const classes = useStyles()
  const canFinish = !isCreating && user && user.username
  return (
    <FormControls className={classes.formControls}>
      <Button
        icon={<ChevronLeftIcon />}
        color="tertiary"
        size="large"
        isDisabled={activeTabIdx === 0}
        onClick={back}
        switchIconSide>
        Back
      </Button>{' '}
      {activeTabIdx === count - 1 ? (
        <Button
          onClick={onFinish}
          isDisabled={!canFinish}
          size="large"
          color="tertiary"
          icon={<FlagIcon />}>
          Finish
        </Button>
      ) : (
        <Button
          icon={<ChevronRightIcon />}
          color="tertiary"
          size="large"
          onClick={next}
          iconSide="right">
          Next
        </Button>
      )}
    </FormControls>
  )
}

const WelcomeMessage = () => (
  <>
    <Heading variant="h3">Welcome to Lippy</Heading>
    <Heading variant="h4">Club Owners / Managers</Heading>
    <BodyText>
      Connect your account with VRChat{' '}
      <Link to={routes.myAccountWithTabNameVar.replace(':tabName', 'vrchat')}>
        here
      </Link>{' '}
      then go to <Link to={routes.clubs}>Clubs</Link> and click Create to get
      started.
    </BodyText>
    <Heading variant="h4">Performers</Heading>
    <BodyText>
      A user on this site can have as many performers (stage names) as they
      like. Club owners/managers will search by name and add you to events. Get
      started by going to <Link to={routes.performers}>Performers</Link> and
      click Create.
    </BodyText>
    <Heading variant="h4">Attendees</Heading>
    <BodyText>
      Go to <Link to={routes.home}>Events</Link> (the homepage) and attend
      events, follow clubs and follow performers.
    </BodyText>
  </>
)

const SetupProfile = ({
  analyticsCategory,
  onDone,
}: {
  analyticsCategory: string
  onDone: () => void
}) => {
  const userId = useUserId()
  const [isLoadingUser, , user, hydrateUser] = useUserRecord()
  const [isCreating, isCreateSuccess, lastCreateErrorCode, save] =
    useDataStoreEdit<UserPreferences>(
      CollectionNames.UserPreferences,
      userId || false
    )
  const [subscribeToDigest, setSubscribeToDigest] = useState(false)
  const location = useLocation()
  const classes = useStyles()

  if (location.pathname === routes.login) {
    return null
  }

  if (!userId) {
    return <LoadingIndicator message="Waiting for user ID..." />
  }

  if (isLoadingUser || !user) {
    return <LoadingIndicator message="Loading your details..." />
  }

  if (isCreating) {
    return <LoadingIndicator message="Creating your profile..." />
  }

  if (isCreateSuccess) {
    return (
      <SuccessMessage>
        Profile has been setup successfully! Redirecting you...
      </SuccessMessage>
    )
  }

  if (lastCreateErrorCode) {
    return (
      <ErrorMessage errorCode={lastCreateErrorCode}>
        Failed to create your profile
      </ErrorMessage>
    )
  }

  const onFinish = async () => {
    try {
      trackAction(analyticsCategory, 'Click finish button')

      const notificationPrefs = {
        ...defaultNotificationPrefs,
        events: {
          ...defaultNotificationPrefs.events,
          [NotificationEvent.DIGEST]: subscribeToDigest,
        },
      }

      await save({
        notificationprefs: notificationPrefs,
      })

      hydrateUser()

      onDone()
    } catch (err) {
      console.error('Failed to save preferences', err)
      handleError(err)
    }
  }

  return (
    <div className={classes.root}>
      <Heading variant="h1">Welcome</Heading>
      <Heading variant="h2">Set up your profile</Heading>

      <Tabs
        horizontal
        items={[
          {
            name: 'welcome',
            label: 'Welcome',
            contents: (
              <TabPanel>
                <WelcomeMessage />
              </TabPanel>
            ),
          },
          {
            name: 'vr-platforms',
            label: 'VR',
            contents: (
              <TabPanel>
                {/* @ts-ignore */}
                <VrPlatformChooser analyticsCategory={analyticsCategory} />{' '}
              </TabPanel>
            ),
          },
          {
            name: 'settings',
            label: 'Settings',
            contents: (
              <TabPanel>
                {/* <div>
                  <CheckboxInput
                    label="Subscribe to our weekly newsletter"
                    onChange={() =>
                      setSubscribeToDigest((currentVal) => !currentVal)
                    }
                    value={subscribeToDigest}
                  />
                  <div className={classes.digestInfo}>
                    Read a summary of new assets posted on the site. Sent every
                    Sunday. You can unsubscribe at any time.
                  </div>
                </div> */}
                <div>
                  <AdultContentToggle />
                </div>
              </TabPanel>
            ),
          },
          {
            name: 'username',
            label: 'Username (required)',
            contents: (
              <TabPanel>
                <UsernameEditor />
              </TabPanel>
            ),
          },
        ]}>
        <TabControls onFinish={onFinish} isCreating={isCreating} />
      </Tabs>
    </div>
  )
}

export default SetupProfile
