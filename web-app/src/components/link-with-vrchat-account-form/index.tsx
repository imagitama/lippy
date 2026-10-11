import React, { useEffect } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'

import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import useUserRecord from '@/hooks/useUserRecord'

import Button, { ButtonProps } from '@/components/button'
import ErrorMessage from '@/components/error-message'
import LoadingIndicator from '@/components/loading-indicator'
import SuccessMessage from '@/components/success-message'
import Paper from '@/components/paper'
import Heading from '@/components/heading'
import { FunctionNames } from '@/vrchat'

enum GenerateVrchatLinkCodeErrorCode {
  NeedVrchatUsername = 'NeedVrchatUsername',
  VrchatUserDoesNotExist = 'VrchatUserDoesNotExist',
  AlreadyHasLinkCode = 'AlreadyHasLinkCode',
  Unknown = 'Unknown',
}

interface GenerateVrchatLinkCodePayload {}

interface GenerateVrchatLinkCodeResponse {
  success: boolean
  code?: number
  errorCode?: GenerateVrchatLinkCodeErrorCode
}

// shared with backend
enum LinkWithVrchatAccountErrorCode {
  NeedLinkCode = 'NeedLinkCode',
  NeedVrchatUsername = 'NeedVrchatUsername',
  VrchatUserDoesNotExist = 'VrchatUserDoesNotExist',
  VrchatStatusDoesNotHaveCode = 'VrchatStatusDoesNotHaveCode',
  Unknown = 'Unknown',
}

interface LinkPayload {}
interface LinkResult {
  success: boolean
  vrchatUserId?: string
  errorCode?: LinkWithVrchatAccountErrorCode
}

interface UnlinkPayload {}
interface UnlinkResult {
  success: boolean
  errorCode?: any // TODO
}

const getMessageForErrorCode = (code: string): string => {
  switch (code) {
    case LinkWithVrchatAccountErrorCode.NeedLinkCode:
      return 'you have not generated a code yet'
    case LinkWithVrchatAccountErrorCode.NeedVrchatUsername:
      return 'you do not have a VRChat username set on your user profile'
    case LinkWithVrchatAccountErrorCode.VrchatUserDoesNotExist:
      return 'the VRChat username you have set does not appear to exist'
    case LinkWithVrchatAccountErrorCode.VrchatStatusDoesNotHaveCode:
      return 'the VRChat account was found but the status does not include the code'
    case GenerateVrchatLinkCodeErrorCode.AlreadyHasLinkCode:
      return 'you already have a link code'
    default:
      return `something unexpected happened: ${code}`
  }
}

const UnlinkAccountWithVrchatButton = (props: ButtonProps) => {
  const [, , user, hydrateUser] = useUserRecord()
  const [
    isUnlinking,
    lastErrorCodeUnlinking,
    unlinkResult,
    performUnlink,
    clearUnlinkResult,
  ] = useSupabaseFunction<UnlinkPayload, UnlinkResult>(
    FunctionNames.UnlinkWithVrchatAccount
  )

  useEffect(() => {
    if (!unlinkResult || !unlinkResult.success) {
      return
    }
    console.debug('was just unlinked, hydrating user...')
    hydrateUser()
  }, [unlinkResult && unlinkResult.success])

  if (isUnlinking) {
    return <LoadingIndicator message="Unlinking..." />
  }

  if (
    lastErrorCodeUnlinking !== null ||
    (unlinkResult && unlinkResult.errorCode)
  ) {
    return (
      <ErrorMessage onOkay={clearUnlinkResult}>
        Failed to unlink:{' '}
        {unlinkResult && unlinkResult.errorCode
          ? getMessageForErrorCode(unlinkResult.errorCode)
          : 'Unknown'}
      </ErrorMessage>
    )
  }

  if (unlinkResult?.success) {
    return (
      <SuccessMessage onOkay={() => clearUnlinkResult()}>
        You have unlinked your VRChat account (and removed any linking codes you
        had). You can try again at any time.
      </SuccessMessage>
    )
  }

  return (
    <Button
      onClick={() => {
        performUnlink({})
      }}
      icon={<LinkOffIcon />}
      {...props}>
      Unlink Account
    </Button>
  )
}

const Form = () => {
  const [
    isLinking,
    lastErrorCodeLinking,
    linkResult,
    performLink,
    clearLinkResult,
  ] = useSupabaseFunction<LinkPayload, LinkResult>(
    FunctionNames.LinkWithVrchatAccount
  )
  const [
    isGeneratingCode,
    lastErrorCodeGeneratingCode,
    generateCodeResult,
    generateCode,
    clearGenerateResult,
  ] = useSupabaseFunction<
    GenerateVrchatLinkCodePayload,
    GenerateVrchatLinkCodeResponse
  >(FunctionNames.GenerateVrchatLinkCode)
  const [, , user, hydrateUser] = useUserRecord()

  useEffect(() => {
    if (!linkResult || !linkResult.success) {
      return
    }
    console.debug(`was just linked, hydrating user...`)
    hydrateUser()
  }, [linkResult && linkResult.success])

  useEffect(() => {
    if (!generateCodeResult || !generateCodeResult.success) {
      return
    }
    console.debug(`got a code, hydrating user...`)
    hydrateUser()
  }, [generateCodeResult && generateCodeResult.success])

  if (!user) {
    return null
  }

  if (isLinking) {
    return <LoadingIndicator message="Linking..." />
  }

  if (lastErrorCodeLinking !== null || (linkResult && linkResult.errorCode)) {
    return (
      <ErrorMessage onOkay={clearLinkResult}>
        Failed to link:{' '}
        {linkResult && linkResult.errorCode
          ? getMessageForErrorCode(linkResult.errorCode)
          : 'Unknown'}
      </ErrorMessage>
    )
  }

  if (isGeneratingCode) {
    return <LoadingIndicator message="Generating link code..." />
  }

  if (
    lastErrorCodeGeneratingCode !== null ||
    (generateCodeResult && generateCodeResult.errorCode)
  ) {
    return (
      <ErrorMessage
        onOkay={() => {
          clearLinkResult()
          clearGenerateResult()
        }}>
        Failed to generate link code:{' '}
        {generateCodeResult && generateCodeResult.errorCode
          ? getMessageForErrorCode(generateCodeResult.errorCode)
          : 'Unknown'}
      </ErrorMessage>
    )
  }

  const onClickPerformLink = () => {
    performLink({})
  }

  if (user.vrchatlinkcode) {
    return (
      <>
        <Heading variant="h3">
          Your link code is <strong>{user.vrchatlinkcode}</strong>
        </Heading>
        <UnlinkAccountWithVrchatButton size="large" color="secondary" />{' '}
        <Button onClick={onClickPerformLink} size="large" icon={<CheckIcon />}>
          Complete Link
        </Button>
      </>
    )
  }

  const onClickGenerateCode = () => {
    generateCode({})
  }

  return (
    <>
      <Button onClick={() => hydrateUser()} color="secondary">
        Refresh
      </Button>
      <Button onClick={onClickGenerateCode}>Generate Code</Button>
    </>
  )
}

const LinkAccountWithVrchatForm = () => {
  const [, , user] = useUserRecord()

  if (!user) {
    return null
  }

  const existingVrchatUserId = user.linkedvrchatuserid

  if (existingVrchatUserId) {
    return (
      <>
        <SuccessMessage>
          You have linked your account with VRChat ❤️
        </SuccessMessage>
        <br />
        <UnlinkAccountWithVrchatButton />
      </>
    )
  }

  return (
    <Paper>
      <div>To link your VRChat account with your account you must:</div>
      <ol>
        <li>Add your VRChat username to your account (go to Social tab)</li>
        <li>Generate a unique 4 digit code</li>
        <li>
          Add the code somewhere in your VRChat in-game status (not your bio)
        </li>
        <li>Click the link button here</li>
      </ol>
      <Form />
    </Paper>
  )
}

export default LinkAccountWithVrchatForm
