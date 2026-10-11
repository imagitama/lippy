import { QueuedItemFailureInfo } from '@/queues'
import Tooltip from '../tooltip'

enum AiErrorCode {
  AiOverloaded = 'AiOverloaded',
  AiQuotaExceeded = 'AiQuotaExceeded',
  PromptBlocked = 'PromptBlocked',
  PromptEndedEarly = 'PromptEndedEarly',
  Unknown = 'unknown',
}

type MessageMap = { [errorName: string]: string }

const getFriendlyMessageFromFailureInfo = (
  failureInfo: QueuedItemFailureInfo<any>,
  messages?: MessageMap
): string => {
  // TODO: better type-safety for data

  switch (failureInfo.code) {
    case AiErrorCode.PromptBlocked:
      return `The AI blocked our prompt: ${failureInfo.data.reason}`
    case AiErrorCode.PromptEndedEarly:
      return `The AI ended their response early: ${failureInfo.data.finishReason}`
    default:
      if (messages && failureInfo.error in messages)
        return messages[failureInfo.error]

      return `Error: ${failureInfo.error}`
  }
}

const FailureInfoOutput = ({
  failureInfo,
  messages,
}: {
  failureInfo: QueuedItemFailureInfo<any>
  messages?: MessageMap
}) => {
  return (
    <Tooltip title={JSON.stringify(failureInfo, null, '  ')}>
      <span>{getFriendlyMessageFromFailureInfo(failureInfo, messages)}</span>
    </Tooltip>
  )
}

export default FailureInfoOutput
