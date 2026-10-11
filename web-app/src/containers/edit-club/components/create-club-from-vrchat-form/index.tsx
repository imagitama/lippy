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

interface GetVrchatGroupsForUserPayload {
  userId: string
}
interface GetVrchatGroupsForUserResult {
  groups: VrchatGroupMembership[]
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

  if (isGetting)
    return <LoadingIndicator message="Getting your VRChat groups..." />

  if (lastErrorCode !== null || !lastResult)
    return (
      <ErrorMessage>
        Failed to get your VRChat groups: {lastErrorCode}
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

  const groupsToRender =
    searchResultIds !== null
      ? lastResult.groups.filter((group) =>
          searchResultIds.includes(group.groupId)
        )
      : lastResult.groups

  return (
    <>
      <SearchInput performSearch={onSearch} />
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
                  '-'
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
  const [selectedGroup, setSelectedGroup] =
    useState<null | VrchatGroupMembership>(null)

  if (!user!.linkedvrchatuserid)
    return (
      <WarningMessage>
        You must link your account with VRChat to continue.
        <br />
        <br />
        <FormControls>
          <Button
            url={routes.myAccountWithTabNameVar.replace(':tabName', 'vrchat')}>
            Link Now
          </Button>
        </FormControls>
      </WarningMessage>
    )

  return (
    <>
      <Heading variant="h1">Create Club from VRChat Group</Heading>
      {!selectedGroup && (
        <VrchatGroups onSelectGroup={(group) => setSelectedGroup(group)} />
      )}
      {selectedGroup && (
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
            vrchatgroupid: selectedGroup.groupId,
            // TODO: resonite/chilloutvr group IDs here too
            name: selectedGroup.name,
            description: selectedGroup.description,
          }}
          getErrorMessage={(code: string) => {
            switch (code) {
              case PostgresErrorCode.UniqueViolation:
                return 'a club with that VRChat group already exists'
            }
            return ''
          }}
        />
      )}
    </>
  )
}

export default CreateClubFromVrchatForm
