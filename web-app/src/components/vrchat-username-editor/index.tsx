import useUserRecord from '@/hooks/useUserRecord'
import NoPermissionMessage from '../no-permission-message'
import TextInput from '../text-input'
import Button from '../button'
import { useState } from 'react'
import useDataStoreEdit from '@/hooks/useDataStoreEdit'
import { CollectionNames, User } from 'shared/modules/users'
import LoadingIndicator from '../loading-indicator'
import SuccessMessage from '../success-message'
import ErrorMessage from '../error-message'

const VrchatUsernameEditor = () => {
  const [, , user] = useUserRecord()
  const [textVal, setTextVal] = useState(user?.vrchatusername || '')
  const [isSaving, isSuccess, lastErrorCode, save] = useDataStoreEdit<User>(
    CollectionNames.Users,
    user ? user.id : false
  )

  if (!user) return <NoPermissionMessage />

  const onClickSave = () => {
    save({
      vrchatusername: textVal || null,
    })
  }

  return (
    <>
      <TextInput
        label="VRChat Username"
        value={textVal}
        onChange={(e) => setTextVal(e.target.value)}
        button={<Button onClick={onClickSave}>Save</Button>}
      />
      {isSaving ? (
        <LoadingIndicator message="Saving..." />
      ) : isSuccess ? (
        <SuccessMessage>Your VRChat username has been saved</SuccessMessage>
      ) : lastErrorCode !== null ? (
        <ErrorMessage errorCode={lastErrorCode}>
          Failed to save VRChat username
        </ErrorMessage>
      ) : null}
    </>
  )
}

export default VrchatUsernameEditor
