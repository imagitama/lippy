import { useEffect, useState } from 'react'
import TextInput from '../text-input'
import Paper from '../paper'

const getInstanceIdFromUrl = (url: string): string | null => {
  const { searchParams } = new URL(url)
  const worldId = searchParams.get('worldId')
  const instanceId = searchParams.get('instanceId')

  if (!worldId || !instanceId) {
    console.warn('URL is missing worldId or instanceId')
    return null
  }

  return `${worldId}:${instanceId}`
}

const VrchatInstanceIdInput = ({
  value,
  onChange,
}: {
  value: string | null
  onChange: (newVal: string | null) => void
}) => {
  const [textVal, setTextVal] = useState('')

  const instanceId = textVal ? getInstanceIdFromUrl(textVal) : null

  // console.debug(`VrchatInstanceIdInput.render`, { value })

  useEffect(() => {
    if (!textVal) return
    // console.debug(`VrchatInstanceIdInput.changed`, { textVal, instanceId })
    onChange(instanceId)
  }, [textVal])

  return (
    <>
      Visit the VRChat website, click an instance, copy its URL here:
      <TextInput
        label="URL"
        value={textVal}
        onChange={(e) => setTextVal(e.target.value)}
        fullWidth
      />
      <small>
        eg.
        https://vrchat.com/home/launch?worldId=wrld_6ad41169-1631-40b6-8a8d-491cc39c408b&instanceId=92902~group(grp_d49c108b-dcf4-49b5-8efa-5cfce12f6c9c)~groupAccessType(plus)~ageGate~region(us)
      </small>
      {value && <Paper>Using instance ID '{value || '(none yet)'}'</Paper>}
    </>
  )
}

export default VrchatInstanceIdInput
