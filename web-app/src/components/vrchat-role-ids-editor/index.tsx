import { useState } from 'react'

import Table, { TableBody, TableRow, TableCell } from '../responsive-table'
import Button, { DeleteButton } from '../button'
import ImportVrchatGroupRolesForm, {
  RoleType,
} from '../import-vrchat-group-roles-form'
import FormControls from '../form-controls'
import NoResultsMessage from '../no-results-message'
import Paper from '../paper'
import { RoleIdAndMemberIds } from '../import-vrchat-group-roles-form/types'

const VrchatRoleIdsEditor = ({
  roleIdsWithMemberIds,
  onChange,
  roleType,
  vrchatGroupId,
}: {
  roleIdsWithMemberIds: RoleIdAndMemberIds[]
  onChange: (newVal: RoleIdAndMemberIds[]) => void
  roleType: RoleType
  vrchatGroupId: string | null
}) => {
  const removeByRoleId = (roleId: string) =>
    onChange(roleIdsWithMemberIds.filter((item) => item.roleId !== roleId))
  const [isImporting, setIsImporting] = useState(false)

  const onImportSuccess = (newVal: RoleIdAndMemberIds[]) => {
    onChange(newVal)
    setIsImporting(false)
  }

  return (
    <>
      <Paper>
        <Table size="small" noMinWidth>
          <TableBody>
            {roleIdsWithMemberIds.length ? (
              roleIdsWithMemberIds.map((item) => (
                <TableRow key={item.roleId}>
                  <TableCell>{item.roleId}</TableCell>
                  <TableCell>{item.memberIds.length} members</TableCell>
                  <TableCell>
                    <DeleteButton
                      size="small"
                      color="secondary"
                      onClick={() => removeByRoleId(item.roleId)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <NoResultsMessage>No roles yet</NoResultsMessage>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      <Paper noMargin>
        {isImporting ? (
          <ImportVrchatGroupRolesForm
            currentItems={roleIdsWithMemberIds}
            onDone={onImportSuccess}
            roleType={roleType}
            vrchatGroupId={vrchatGroupId}
          />
        ) : (
          <FormControls>
            <Button onClick={() => setIsImporting(true)}>
              Import from VRChat Group
            </Button>
          </FormControls>
        )}
      </Paper>
    </>
  )
}

export default VrchatRoleIdsEditor
