import Button from '@/components/button'
import ErrorMessage from '@/components/error-message'
import HintText from '@/components/hint-text'
import LoadingIndicator from '@/components/loading-indicator'
import SuccessMessage from '@/components/success-message'
import { InfoIconWithTooltip } from '@/components/tooltip'
import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import { Refresh as RefreshIcon } from '@/icons'

enum FunctionNames {
  HydrateEventVrchatInstances = 'hydrateEventVrchatInstances',
}

interface HydrateVrchatInstancesPayload {}
interface HydrateVrchatInstancesResult {
  success: boolean
  error?: string
}

const HydrateVrchatInstancesButton = () => {
  const [isCalling, lastErrorCode, lastResult, callFunc, clear] =
    useSupabaseFunction<
      HydrateVrchatInstancesPayload,
      HydrateVrchatInstancesResult
    >(FunctionNames.HydrateEventVrchatInstances)

  if (isCalling) return <LoadingIndicator message="Syncing..." />

  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode} onOkay={clear}>
        Failed to sync
      </ErrorMessage>
    )

  const onClick = async () => {
    await callFunc({})
  }

  return (
    <>
      {lastResult !== null ? (
        lastResult.success ? (
          <SuccessMessage>
            Successfully synced
            <br />
            <br />
            {JSON.stringify(lastResult)}
          </SuccessMessage>
        ) : (
          <ErrorMessage>Failed to update: {lastResult.error!}</ErrorMessage>
        )
      ) : null}
      <Button onClick={onClick} icon={<RefreshIcon />}>
        Sync Event Instances
      </Button>
    </>
  )
}

export default HydrateVrchatInstancesButton
