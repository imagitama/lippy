import { useEffect, useState } from 'react'

import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import {
  VrchatGroupMemberUser,
  VrchatGroupRole,
} from 'shared/modules/vrchat-cache'

import LoadingIndicator from '../loading-indicator'
import ErrorMessage from '../error-message'
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../responsive-table'
import Button from '../button'
import InfoMessage from '../info-message'
import CheckboxInput from '../checkbox-input'
import FormControls from '../form-controls'
import NoValueLabel from '../no-value-label'
import ExpandIcon from '../expand-icon'
import { RoleIdAndMemberIds } from './types'

enum SupabaseFunctionNames {
  GetVrchatGroupRoles = 'getVrchatGroupRoles',
}

interface RoleAndMember {
  role: VrchatGroupRole
  members: VrchatGroupMemberUser[]
}

interface GetVrchatGroupRolesPayload {
  vrchatGroupId: string
}
interface GetVrchatGroupRolesResult {
  success: boolean
  rolesAndMembers?: RoleAndMember[]
  error?: string
}

export enum RoleType {
  Owner,
  Mod,
}

const getLabelForPermission = (permStr: string): string => {
  switch (permStr) {
    case '*':
      return 'All permissions'
    case 'group-instance-open-create':
      return 'Create open group instances'
    case 'group-instance-plus-create':
      return 'Create plus group instances'
    case 'group-instance-public-create':
      return 'Create public group instances'
    case 'group-instance-join':
      return 'Join group instances'
    case 'group-members-viewall':
      return 'View all group members'
    default:
      return permStr
  }
}

const ImportVrchatGroupRolesForm = ({
  currentItems,
  roleType,
  onDone,
  vrchatGroupId,
}: {
  currentItems: RoleIdAndMemberIds[]
  roleType: RoleType
  onDone: (result: RoleIdAndMemberIds[]) => void
  vrchatGroupId: string | null
}) => {
  const [isCalling, lastErrorCodeGetting, lastGetResult, performGet] =
    useSupabaseFunction<GetVrchatGroupRolesPayload, GetVrchatGroupRolesResult>(
      SupabaseFunctionNames.GetVrchatGroupRoles
    )
  const [selectedRoles, setSelectedRoles] =
    useState<RoleIdAndMemberIds[]>(currentItems)
  const [expandedRoleId, setExpandedRoleId] = useState<null | string>(null)

  useEffect(() => {
    if (!vrchatGroupId) return
    ;(async () => {
      const result = await performGet({
        vrchatGroupId,
      })

      if (result.rolesAndMembers) {
        setSelectedRoles((currentVal) =>
          currentVal.map((currentItem) => ({
            ...currentItem,
            memberIds:
              result
                .rolesAndMembers!.find(
                  (item) => item.role.id === currentItem.roleId
                )
                ?.members.map((member) => member.id) || currentItem.memberIds,
          }))
        )
      }
    })()
  }, [])

  if (!vrchatGroupId) {
    return <InfoMessage>No VRChat group ID provided</InfoMessage>
  }

  if (isCalling)
    return <LoadingIndicator message="Fetching VRChat group roles..." />

  if (lastErrorCodeGetting !== null)
    return (
      <ErrorMessage errorCode={lastErrorCodeGetting}>
        Failed to load VRChat group roles
      </ErrorMessage>
    )

  if (!lastGetResult?.success)
    return (
      <ErrorMessage>
        Failed to load VRChat group roles:{' '}
        {lastGetResult?.error || '(no error)'}
      </ErrorMessage>
    )

  if (!lastGetResult.rolesAndMembers)
    return <ErrorMessage>No roles</ErrorMessage>

  const onToggle = (roleId: string, newVal: boolean, userIds: string[]) =>
    newVal
      ? setSelectedRoles((prev) =>
          prev.some((r) => r.roleId === roleId)
            ? prev.map((r) =>
                r.roleId === roleId ? { roleId, memberIds: userIds } : r
              )
            : [...prev, { roleId, memberIds: userIds }]
        )
      : setSelectedRoles((prev) => prev.filter((r) => r.roleId !== roleId))

  const onClickDone = () => onDone(selectedRoles)

  return (
    <>
      <Table size="small" noMinWidth>
        <TableHead>
          <TableRow>
            <TableCell>Role</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Management</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell>Members</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {lastGetResult.rolesAndMembers.map(({ role, members }) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.description || '-'}</TableCell>
              <TableCell>{role.isManagementRole ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {role.permissions.length ? (
                  role.permissions.map((permStr) => (
                    <div key={permStr}>{getLabelForPermission(permStr)}</div>
                  ))
                ) : (
                  <NoValueLabel>No permissions</NoValueLabel>
                )}
              </TableCell>
              <TableCell>
                {members.length}{' '}
                <ExpandIcon
                  isExpanded={expandedRoleId === role.id}
                  onClick={() =>
                    setExpandedRoleId((currentVal) =>
                      currentVal === role.id ? null : role.id
                    )
                  }
                />
                {expandedRoleId === role.id ? (
                  <>
                    <ul>
                      {members.map((member) => (
                        <li key={member.id}>{member.displayName}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </TableCell>
              <TableCell>
                <CheckboxInput
                  value={
                    selectedRoles.find((item) => item.roleId === role.id) !==
                    undefined
                  }
                  onChange={(newVal) =>
                    onToggle(
                      role.id,
                      newVal,
                      members.map((mem) => mem.id)
                    )
                  }
                  label="Use This Role"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FormControls>
        <Button onClick={onClickDone}>Done</Button>
      </FormControls>
    </>
  )
}

export default ImportVrchatGroupRolesForm
