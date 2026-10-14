import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import LoadingIndicator from '../loading-indicator'
import ErrorMessage from '../error-message'
import Button from '../button'
import SuccessMessage from '../success-message'
import WarningMessage from '../warning-message'

enum JoinBotToVrchatGroupErrorCode {
  GroupInviteOnly = 'GroupInviteOnly',
  GroupNoExist = 'GroupNoExist',
  RequestAlreadySent = 'RequestAlreadySent',
  AlreadyMember = 'AlreadyMember',
  Unknown = 'Unknown',
}

interface JoinBotToVrchatGroupPayload {
  vrchatGroupId: string
}
interface JoinBotToVrchatGroupResult {
  success: boolean
  isActuallyMember?: boolean
  errorCode?: JoinBotToVrchatGroupErrorCode
}

enum FunctionNames {
  JoinBotToVrchatGroup = 'joinBotToVrchatGroup',
}

const JoinBotToVrchatGroupForm = ({
  vrchatGroupId,
  onSuccess,
}: {
  vrchatGroupId: string
  onSuccess?: () => void
}) => {
  const [isCalling, lastErrorCode, lastResult, performJoin] =
    useSupabaseFunction<
      JoinBotToVrchatGroupPayload,
      JoinBotToVrchatGroupResult
    >(FunctionNames.JoinBotToVrchatGroup)

  const onClickJoin = () => {
    performJoin({
      vrchatGroupId,
    })
  }

  if (isCalling) return <LoadingIndicator message="Joining..." />
  if (lastErrorCode !== null)
    return <ErrorMessage errorCode={lastErrorCode}>Failed to join</ErrorMessage>

  if (lastResult) {
    if (lastResult.success) {
      if (lastResult.isActuallyMember) {
        return (
          <SuccessMessage
            controls={
              onSuccess && (
                <Button onClick={onSuccess} color="secondary">
                  Proceed
                </Button>
              )
            }>
            The bot has successfully joined the VRChat group
          </SuccessMessage>
        )
      } else {
        return (
          <SuccessMessage
            controls={
              <Button onClick={onClickJoin} color="secondary">
                Try Again
              </Button>
            }>
            The bot has requested to join the VRChat group. Someone must accept
            the invite then try again.
          </SuccessMessage>
        )
      }
    } else {
      if (
        lastResult.errorCode === JoinBotToVrchatGroupErrorCode.AlreadyMember
      ) {
        return (
          <SuccessMessage
            controls={
              onSuccess && (
                <Button onClick={onSuccess} color="secondary">
                  Proceed
                </Button>
              )
            }>
            The bot is a member of the VRChat group
          </SuccessMessage>
        )
      }
      if (
        lastResult.errorCode ===
        JoinBotToVrchatGroupErrorCode.RequestAlreadySent
      ) {
        return (
          <WarningMessage
            controls={
              <Button onClick={onClickJoin} color="secondary">
                Try Again
              </Button>
            }>
            The bot has already sent an invite to the VRChat group. Someone must
            accept the invite then try again.
          </WarningMessage>
        )
      }
      return (
        <ErrorMessage>
          The bot failed to join: {lastResult.errorCode}
        </ErrorMessage>
      )
    }
  }

  return (
    <>
      <Button onClick={onClickJoin}>Request Bot Join VRChat Group</Button>
    </>
  )
}

export default JoinBotToVrchatGroupForm
