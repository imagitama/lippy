import VerifiedIcon from '@mui/icons-material/Verified'

import Button from '@/components/button'
import ErrorMessage from '@/components/error-message'
import GenericEditor from '@/components/generic-editor'
import Heading from '@/components/heading'
import LoadingIndicator from '@/components/loading-indicator'
import Paper from '@/components/paper'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/responsive-table'
import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import useUserRecord from '@/hooks/useUserRecord'
import { FunctionNames } from '@/vrchat'
import { useEffect, useState } from 'react'
import { VrchatGroup, VrchatGroupMembership } from 'shared/modules/vrchat-cache'
import { Club, CollectionNames } from 'shared/modules/clubs'
import editableFields from '@/editable-fields/clubs'
import { routes } from '@/routes'
import InfoMessage from '@/components/info-message'
import SearchInput from '@/components/search-input'
import StatusText from '@/components/status-text'
import { PostgresErrorCode } from '@/data-store'
import FormControls from '@/components/form-controls'
import WarningMessage from '@/components/warning-message'
import JoinBotToVrchatGroupForm from '@/components/join-bot-to-vrchat-group-form'
import NoPermissionMessage from '@/components/no-permission-message'
import SyncVrchatGroupForm from '@/components/sync-vrchat-group-form'

interface GetVrchatGroupsForUserPayload {
  userId: string
}
interface GetVrchatGroupsForUserResult {
  success: boolean
  error?: string
  groups: VrchatGroupMembership[]
}

const getMessageForError = (errorName: string): string => {
  switch (errorName) {
    // TODO: use codes
    case 'VrchatApiError':
      return 'there was an issue talking to VRChat. Please report this to our Discord.'
    case 'VrchatApiOverloadedError':
      return 'there was an issue talking to VRChat. Our bot might be temporarily blocked if we are spamming their servers too much. Please report this to our Discord and try again in 1 hour.'
    default:
      return `something unexpected happened: ${errorName}`
  }
}

const VrchatGroups = ({
  onSelectGroup,
}: {
  onSelectGroup: (group: VrchatGroupMembership) => void
}) => {
  const [, , user] = useUserRecord()
  const [isGetting, lastErrorCode, lastResult, callFunc] = useSupabaseFunction<
    GetVrchatGroupsForUserPayload,
    GetVrchatGroupsForUserResult
  >(FunctionNames.GetVrchatGroupsForUser)
  const [searchResultIds, setSearchResultIds] = useState<null | string[]>(null)

  useEffect(() => {
    callFunc({
      userId: user!.id,
    })
  }, [])

  if (lastErrorCode !== null)
    return (
      <ErrorMessage>
        Failed to get your VRChat groups: {lastErrorCode}
      </ErrorMessage>
    )

  if (isGetting || !lastResult)
    return <LoadingIndicator message="Getting your VRChat groups..." />

  if (lastResult && !lastResult.success)
    return (
      <ErrorMessage>
        Failed to get your VRChat groups:{' '}
        {getMessageForError(lastResult.error!)}
      </ErrorMessage>
    )

  const onSearch = (term: string) => {
    if (!lastResult?.groups || term.length < 2) {
      setSearchResultIds(null)
      return
    }

    console.debug(`onSearch`, term)

    const matches = lastResult.groups.filter((group) =>
      group.name.toLocaleLowerCase().includes(term.toLocaleLowerCase())
    )

    setSearchResultIds(matches.map((group) => group.groupId))
  }

  const groupsByOwnership = lastResult.groups.sort((groupA, groupB) =>
    groupA.ownerId === user?.linkedvrchatuserid ? -1 : 1
  )

  const groupsToRender =
    searchResultIds !== null
      ? groupsByOwnership.filter((group) =>
          searchResultIds.includes(group.groupId)
        )
      : groupsByOwnership

  return (
    <>
      <FormControls>
        <SearchInput performSearch={onSearch} />
      </FormControls>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Short Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Members</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupsToRender.map((group) => (
            <TableRow key={group.groupId}>
              <TableCell>
                {group.shortCode}#{group.discriminator}
              </TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.description.slice(0, 128)}</TableCell>
              <TableCell>{group.memberCount}</TableCell>
              <TableCell>
                {group.ownerId === user!.linkedvrchatuserid ? (
                  <StatusText positivity={1}>
                    <VerifiedIcon /> You are the owner
                  </StatusText>
                ) : (
                  <StatusText positivity={-1}>You are not the owner</StatusText>
                )}
              </TableCell>
              <TableCell>
                <Button color="secondary" onClick={() => onSelectGroup(group)}>
                  Use This Group
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

const CreateClubFromVrchatForm = () => {
  const [, , user] = useUserRecord()
  const [groupMem, setGroupMem] = useState<null | VrchatGroupMembership>(null)
  const [isBotMemberOfGroup, setIsBotMemberOfGroup] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)
  const [needsManagement, setNeedsManagement] = useState<null | boolean>(null) // null to skip
  const [isManagement, setIsManagement] = useState<null | boolean>(null) // null is unknown

  useEffect(() => {
    if (!groupMem?.ownerId || !user?.linkedvrchatuserid) return

    if (groupMem.ownerId !== user.linkedvrchatuserid) {
      setNeedsManagement(true)
      setIsManagement(null)
    }
  }, [groupMem?.ownerId, user?.linkedvrchatuserid])

  const onClickSkipJoiningGroup = () => setIsSkipping(true)

  const onSyncVrchatGroupSuccess = ({
    managementUserIds,
  }: {
    managementUserIds?: string[]
  }) => {
    if (!user?.linkedvrchatuserid)
      throw new Error('No user or linked vrchat user ID')

    if (!managementUserIds)
      throw new Error('No management user IDs (bot not in group?)')

    const isMatch = managementUserIds.includes(user.linkedvrchatuserid)
    setIsManagement(isMatch)
  }

  if (!user) return <NoPermissionMessage />

  if (!user.linkedvrchatuserid)
    return (
      <ErrorMessage>
        You must link your account with VRChat to create a club.
        <br />
        <br />
        <FormControls>
          <Button
            url={routes.myAccountWithTabNameVar.replace(':tabName', 'vrchat')}>
            Link Now
          </Button>
        </FormControls>
      </ErrorMessage>
    )

  if (groupMem) {
    if (needsManagement && isManagement !== true) {
      return (
        <>
          <WarningMessage title="Group Ownership">
            You are not the owner of the VRChat group. You can create the club
            however you cannot assign any permissions and the real owner may
            assume control and kick you out.
            <br />
            <br />
            <strong>
              We strongly recommend you only create clubs for groups you own.
            </strong>
          </WarningMessage>
          {isBotMemberOfGroup ? (
            <InfoMessage title="Verify Role">
              Click this button to verify you have a management role inside the
              VRChat group:
              <FormControls>
                <SyncVrchatGroupForm
                  vrchatGroupId={groupMem.groupId}
                  onSuccess={onSyncVrchatGroupSuccess}
                />
              </FormControls>
            </InfoMessage>
          ) : (
            <InfoMessage title="Verify Role">
              To verify you have the management role inside the VRChat group
              (aka you can edit the group name/desc/etc.) our bot needs to join
              your group.
              <br />
              <br />
              You can kick the bot after but we recommend it stays there so we
              can automatically output group instance info in the VRC world.
              <FormControls>
                <JoinBotToVrchatGroupForm
                  vrchatGroupId={groupMem.groupId}
                  onSuccess={() => setIsBotMemberOfGroup(true)}
                />
              </FormControls>
            </InfoMessage>
          )}
        </>
      )
    } else if (isManagement === false) {
      return (
        <ErrorMessage>
          You do not have a management role inside the VRChat group. Please
          confirm with the VRChat group owner that you have a management role
          (eg. you can edit the group name).
        </ErrorMessage>
      )
    }

    if (!isBotMemberOfGroup && isSkipping === false) {
      return (
        <>
          <InfoMessage>
            If you want Lippy to automatically find your group instances for
            your events our bot must join your group (and stay in the group for
            the duration of your event). This is entirely optional.
          </InfoMessage>
          <FormControls>
            <JoinBotToVrchatGroupForm
              vrchatGroupId={groupMem.groupId}
              onSuccess={() => setIsBotMemberOfGroup(true)}
            />
          </FormControls>
          <FormControls>
            <Button onClick={onClickSkipJoiningGroup} color="secondary">
              Skip
            </Button>
          </FormControls>
        </>
      )
    } else {
      return (
        <>
          <GenericEditor<Club>
            fields={editableFields}
            collectionName={CollectionNames.Clubs}
            analyticsCategory={'CreateClub'}
            saveBtnAction="Click save club button"
            cancelBtnAction="Click cancel button"
            getSuccessUrl={(newId) =>
              routes.viewClubWithVar.replace(':clubId', newId!)
            }
            overrideFields={{
              vrchatgroupid: groupMem.groupId,
              // TODO: resonite/chilloutvr group IDs here too
              name: groupMem.name,
              description: groupMem.description,
              vrchatowneruserids: isManagement ? [user.linkedvrchatuserid] : [],
            }}
            getErrorMessage={(code: string) => {
              switch (code) {
                case PostgresErrorCode.UniqueViolation:
                  return 'a club with that VRChat group already exists'
              }
              return ''
            }}
            extraFormData={{
              isManagement,
            }}
          />
        </>
      )
    }
  }

  return <VrchatGroups onSelectGroup={(groupMem) => setGroupMem(groupMem)} />
}

export default CreateClubFromVrchatForm
