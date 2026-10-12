import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import { VrchatGroup } from 'shared/modules/vrchat-cache'
import LoadingIndicator from '../loading-indicator'
import ErrorMessage from '../error-message'
import Button from '../button'
import Heading from '../heading'

interface SyncVrchatGroupPayload {
  vrchatGroupId: string
}
interface SyncVrchatGroupResult {
  group: VrchatGroup
  //   ownerIds: string[]
  //   otherStaffIds: string[]
  error?: string
}

enum FunctioNames {
  SyncVrchatGroup = 'syncVrchatGroup',
}

const VrchatGroupOutput = ({
  group,
}: //   ownerIds,
//   otherStaffIds,
{
  group: VrchatGroup
  //   ownerIds: string[]
  //   otherStaffIds: string[]
}) => {
  return (
    <div>
      Group "{group.name}"
      <hr />
      {group.description}
      <hr />
      Owned by {group.ownerId}
      {/* <Heading variant="h3">Group Owners/Super-Admins</Heading>
      <ul>
        {ownerIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
      <Heading variant="h3">Other Staff</Heading>
      <ul>
        {otherStaffIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul> */}
    </div>
  )
}

const SyncVrchatGroupForm = ({
  vrchatGroupId,
}: {
  vrchatGroupId: string | null
}) => {
  const [isSyncing, lastErrorCode, lastResult, performSync] =
    useSupabaseFunction<SyncVrchatGroupPayload, SyncVrchatGroupResult>(
      FunctioNames.SyncVrchatGroup
    )

  if (vrchatGroupId === null)
    return <ErrorMessage>Cannot sync - no VRChat group ID</ErrorMessage>

  const onClickSync = () => {
    performSync({
      vrchatGroupId,
    })
  }

  if (isSyncing) return <LoadingIndicator message="Syncing VRChat group..." />

  if (lastErrorCode !== null)
    return <ErrorMessage errorCode={lastErrorCode}>Failed to sync</ErrorMessage>

  if (lastResult) {
    if (lastResult.error)
      return <ErrorMessage>Failed to sync: {lastResult.error}</ErrorMessage>

    return <VrchatGroupOutput {...lastResult} />
  }

  return (
    <Button
      onClick={onClickSync}
      title="Fetches the VRChat group and stores it for usage later">
      Sync VRChat Group
    </Button>
  )
}

export default SyncVrchatGroupForm
