import React from 'react'
import { Helmet } from '@unhead/react/helmet'
import AddIcon from '@mui/icons-material/Add'

import * as routes from '@/routes'
import { trackAction } from '@/analytics'

import useUserRecord from '@/hooks/useUserRecord'
import usePermissions from '@/hooks/usePermissions'

import Tabs from '@/components/tabs'
import LoadingIndicator from '@/components/loading-indicator'
import AvatarUploadForm from '@/components/avatar-upload-form'
import UsernameEditor from '@/components/username-editor'
import AdultContentToggle from '@/components/adult-content-toggle'
import Heading from '@/components/heading'
import NoPermissionMessage from '@/components/no-permission-message'
import VrchatUsernameEditor from '@/components/vrchat-username-editor'
import BioEditor from '@/components/bio-editor'
import NotificationSettings from '@/components/notification-settings'
import MyReports from '@/components/my-reports'
import LinkAccountWithVrchatForm from '@/components/link-with-vrchat-account-form'
import ChangeEmailForm from '@/components/change-email-form'
import DeleteAccountForm from '@/components/delete-account-form'
import ChangePasswordForm from '@/components/change-password-form'
import Discord from './components/discord'
import MyUserOverview from '@/components/my-user-overview'
import VrchatGroupButton from '@/components/vrchat-group-button'
import Button from '@/components/button'

import Features from './components/features'
import MySupportTickets from './components/my-support-tickets'
import FormControls from '@/components/form-controls'
import MultiFactorAuthForm from '@/components/multi-factor-auth-form'
import MyEvents from './components/my-events'
import MyClubs from './components/my-clubs'
import MyPerformers from './components/my-performers'
import Block from '@/components/block'

const analyticsCategoryName = 'MyAccount'

const View = () => {
  const [, , user] = useUserRecord()

  if (!usePermissions(routes.myAccount)) {
    return <NoPermissionMessage />
  }

  // if they just signed up
  if (!user || !user.username) {
    return <LoadingIndicator message="Waiting for your profile..." />
  }

  return (
    <>
      <Heading variant="h1">Your Account</Heading>
      <Tabs
        urlWithTabNameVar={routes.myAccountWithTabNameVar}
        items={[
          {
            name: 'overview',
            label: 'Overview',
            contents: <MyUserOverview />,
          },
          {
            name: 'profile',
            label: 'profile',
            contents: (
              <>
                <Heading variant="h2">Profile</Heading>
                <Block title="Username">
                  <p>
                    You can change your username as many times as you would
                    like.
                  </p>
                  <UsernameEditor
                    onSaveClick={() =>
                      trackAction(analyticsCategoryName, 'Click save username')
                    }
                  />
                </Block>
                <Block title="Avatar">
                  <p>
                    Your avatar is shown on your profile, your comments and in
                    lists of users.
                  </p>
                  <AvatarUploadForm
                    onClick={() =>
                      trackAction(
                        analyticsCategoryName,
                        'Click avatar upload form'
                      )
                    }
                  />
                </Block>
                <Block title="Bio">
                  <p>This bio is shown on your public user profile.</p>
                  <BioEditor
                    // @ts-ignore
                    onSaveClick={() =>
                      trackAction(
                        analyticsCategoryName,
                        'Click save bio button'
                      )
                    }
                  />
                </Block>
              </>
            ),
          },
          {
            name: 'events',
            label: 'My Events',
            contents: <MyEvents />,
          },
          {
            name: 'clubs',
            label: 'My Clubs',
            contents: <MyClubs />,
          },
          {
            name: 'performers',
            label: 'My Performers',
            contents: <MyPerformers />,
          },
          {
            name: 'settings',
            label: 'Settings',
            contents: (
              <>
                <Heading variant="h2">Settings</Heading>
                <Block title="Settings">
                  <div>
                    <AdultContentToggle
                      analyticsCategoryName={analyticsCategoryName}
                    />
                  </div>
                </Block>
                <Block title="Features">
                  <Features />
                </Block>
                <Block title="Notifications">
                  <NotificationSettings />
                </Block>
              </>
            ),
          },
          {
            name: 'auth',
            label: 'Auth',
            contents: (
              <>
                <Heading variant="h2">Authentication</Heading>
                <Block title="Multi-Factor Authentication">
                  <MultiFactorAuthForm />
                </Block>
                <Block title="Change Email Address">
                  <p>
                    Use this form to change your signup email address to
                    something else.
                  </p>
                  <ChangeEmailForm />
                </Block>
                <Block title="Change Password">
                  <p>
                    Use this form to change your password to something else.
                  </p>
                  <ChangePasswordForm />
                </Block>
                <Block title="Danger Zone">
                  <DeleteAccountForm />
                </Block>
              </>
            ),
          },
          {
            name: 'vrchat',
            label: 'VRChat',
            contents: (
              <>
                <Heading variant="h2">VRChat</Heading>
                <Block title="Group">
                  <VrchatGroupButton />
                </Block>
                <Block title="Link Account">
                  <VrchatUsernameEditor />
                  <LinkAccountWithVrchatForm />
                </Block>
              </>
            ),
          },
          // {
          //   name: 'patreon',
          //   label: 'Patreon',
          //   contents: (
          //     <>
          //       <Heading variant="h2">Patreon</Heading>
          //       <Heading variant="h3">Link Account</Heading>
          //       <PatreonConnectForm />
          //       <Heading variant="h3">Badge</Heading>
          //       <SupporterBadgeForm
          //         route={routes.viewUserWithVar.replace(':userId', user.id)}
          //       />
          //     </>
          //   ),
          // },
          {
            name: 'reports',
            label: 'My Reports',
            contents: (
              <>
                <Heading variant="h2">My Reports</Heading>
                <MyReports />
              </>
            ),
          },
          {
            name: 'support-tickets',
            label: 'My Support Tickets',
            contents: (
              <>
                <Heading variant="h2">My Support Tickets</Heading>
                <FormControls>
                  <Button
                    url={routes.createSupportTicket}
                    size="large"
                    icon={<AddIcon />}>
                    Create Support Ticket
                  </Button>
                </FormControls>
                <MySupportTickets />
              </>
            ),
          },
          {
            name: 'discord',
            label: 'Discord',
            contents: (
              <>
                <Heading variant="h2">Discord</Heading>
                <Discord />
              </>
            ),
          },
        ]}
      />
    </>
  )
}

export default () => (
  <>
    <Helmet>
      <title>Manage your account</title>
      <meta
        name="description"
        content="Change your personal details and settings for your account."
      />
    </Helmet>
    <View />
  </>
)
