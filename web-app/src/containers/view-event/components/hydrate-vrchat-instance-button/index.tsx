import Button from '@/components/button'
import ErrorMessage from '@/components/error-message'
import HintText from '@/components/hint-text'
import LoadingIndicator from '@/components/loading-indicator'
import SuccessMessage from '@/components/success-message'
import { InfoIconWithTooltip } from '@/components/tooltip'
import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import { Refresh as RefreshIcon } from '@/icons'

enum FunctionNames {
  HydrateEventVrchatInstance = 'hydrateEventVrchatInstance',
  HydrateEventVrchatInstances = 'hydrateEventVrchatInstances',
}

interface HydrateEventVrchatInstancePayload {
  eventId: string
}
interface HydrateEventVrchatInstanceResult {
  success: boolean
  instanceId?: string | null
  error?: string
}

// interface HydrateVrchatInstancesPayload {}
// interface HydrateVrchatInstancesResult {
//   success: boolean
//   error?: string
// }

const HydrateVrchatInstanceButton = ({
  eventId,
  hydrate,
}: {
  eventId: string
  hydrate: () => void
}) => {
  // const [isCalling, lastErrorCode, lastResult, callFunc, clear] =
  //   useSupabaseFunction<
  //     HydrateVrchatInstancesPayload,
  //     HydrateVrchatInstancesResult
  //   >(FunctionNames.HydrateEventVrchatInstances)

  const [isCalling, lastErrorCode, lastResult, callFunc, clear] =
    useSupabaseFunction<
      HydrateEventVrchatInstancePayload,
      HydrateEventVrchatInstanceResult
    >(FunctionNames.HydrateEventVrchatInstance)

  if (isCalling) return <LoadingIndicator message="Syncing..." />

  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode} onOkay={clear}>
        Failed to sync
      </ErrorMessage>
    )

  const onClick = async () => {
    await callFunc({
      eventId,
    })
    hydrate()
  }

  return (
    <>
      {lastResult !== null ? (
        lastResult.success ? (
          <SuccessMessage>
            Successfully synced
            <br />
            <br />
            Instance ID: {lastResult.instanceId || '(no instance found)'}
          </SuccessMessage>
        ) : (
          <ErrorMessage>Failed to update: {lastResult.error!}</ErrorMessage>
        )
      ) : null}
      <Button onClick={onClick} icon={<RefreshIcon />}>
        Sync Event Instance
      </Button>
      <br />
      <InfoIconWithTooltip
        title="If your event has an instance ID, it is fetched from VRChat. Otherwise
        it finds the first VRChat group instance for your club."
      />
    </>
  )
}

export default HydrateVrchatInstanceButton
