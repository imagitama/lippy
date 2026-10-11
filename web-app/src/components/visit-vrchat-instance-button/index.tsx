import { VrchatInstance } from 'shared/modules/vrchat-cache'
import Button from '../button'
import Paper from '../paper'
import VrchatInstanceCard from '../vrchat-instance-card'

import JoinIcon from '@kurone-kito/launchpad-icons-react/dist/Join'

const getUrlForInstanceId = (id: string): string => {
  const separatorIndex = id.indexOf(':')

  if (separatorIndex === -1) {
    throw new Error('Invalid instance ID: expected worldId:instanceId')
  }

  const worldId = id.slice(0, separatorIndex)
  const instanceId = id.slice(separatorIndex + 1)

  const params = new URLSearchParams({ worldId, instanceId })

  return `https://vrchat.com/home/launch?${params}`
}

const VisitVrchatInstanceButton = ({
  instance,
  fetchedAt,
}: {
  instance: VrchatInstance | null
  fetchedAt?: string // date
}) => {
  if (!instance) {
    return (
      <Button size="large" isDisabled>
        No Instance Found
      </Button>
    )
  }

  return (
    <VrchatInstanceCard instance={instance} fetchedAt={fetchedAt}>
      <Button
        size="large"
        url={getUrlForInstanceId(instance.id)}
        icon={<JoinIcon />}>
        Join Instance
      </Button>
    </VrchatInstanceCard>
  )
}

export default VisitVrchatInstanceButton
