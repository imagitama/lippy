import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ButtonGroup from '@mui/material/ButtonGroup'

import { handleError } from '@/error-handling'
import { AccessStatus, MetaRecord } from 'shared/modules/common'

import useDataStoreEdit from '@/hooks/useDataStoreEdit'
import useDataStoreItem from '@/hooks/useDataStoreItem'

import Button, { ButtonProps } from '@/components/button'
import LoadingIndicator from '@/components/loading-indicator'
import ButtonDropdown from '@/components/button-dropdown'

type DeletionReason = any

// TODO: update <DeleteButton /> to use
export const DeleteButtonBase = ({
  existingAccessStatus,
  existingReason,
  onDelete,
  onUndelete,
  onReasonChange,
}: {
  existingAccessStatus: AccessStatus | null
  existingReason: DeletionReason | null
  onDelete: (reason: DeletionReason | null) => void
  onUndelete: () => void
  onReasonChange: (reason: DeletionReason | null) => void
}) => {
  const [selectedReason, setSelectedReason] = useState<DeletionReason | null>(
    existingReason || null
  )

  const toggle = () => {
    if (existingAccessStatus === AccessStatus.Public) {
      onDelete(selectedReason)
    } else {
      onUndelete()
    }
  }

  const onClickUpdate = () => {
    onReasonChange(selectedReason)
  }

  const hasChangedReason = selectedReason !== existingReason

  return (
    <ButtonGroup>
      <Button
        onClick={toggle}
        icon={<DeleteIcon />}
        size="small"
        color="secondary"
        hollow={false}>
        {existingAccessStatus === AccessStatus.Deleted
          ? 'Un-delete'
          : `Delete${hasChangedReason ? ` (${selectedReason})` : ''}`}
      </Button>
    </ButtonGroup>
  )
}

const DeleteButton = ({
  id,
  metaCollectionName,
  existingAccessStatus,
  existingDeletionReason,
  onClick,
  onDone,
  onOverrideUndelete,
  onOverrideDelete,
  onOverrideUpdateReason,
  ...buttonProps
}: {
  id: string
  metaCollectionName: string
  existingAccessStatus?: AccessStatus
  existingDeletionReason?: DeletionReason | null
  onClick?: ({ newValue }: { newValue: AccessStatus }) => void
  onDone?: () => void
  onOverrideUndelete?: () => void
  onOverrideDelete?: (reason: DeletionReason | null) => void
  onOverrideUpdateReason?: (reason: DeletionReason | null) => void
} & ButtonProps) => {
  const [isLoading, lastErrorCodeLoading, metaRecord] =
    useDataStoreItem<MetaRecord>(
      metaCollectionName,
      existingAccessStatus !== undefined ? false : id,
      { queryName: 'delete-button' }
    )
  const [isSaving, , lastErrorCodeSaving, save] = useDataStoreEdit<MetaRecord>(
    metaCollectionName,
    id
  )
  const [selectedReason, setSelectedReason] = useState<DeletionReason | null>(
    existingDeletionReason || null
  )

  if (isLoading || isSaving) {
    return <LoadingIndicator message={isLoading ? 'Loading...' : 'Saving...'} />
  }

  if (!existingAccessStatus && !metaRecord) {
    console.warn(
      'Cannot render button: no existing access status and no meta record'
    )
    return null
  }

  const accessStatus =
    existingAccessStatus || (metaRecord ? metaRecord.accessstatus : undefined)

  if (lastErrorCodeLoading !== null) {
    return <>Failed to load record (code {lastErrorCodeLoading})</>
  }

  if (!accessStatus) {
    return <>Failed to load record (invalid access status)</>
  }

  if (lastErrorCodeSaving !== null) {
    return <>Failed to save record (code {lastErrorCodeSaving})</>
  }

  const toggle = async () => {
    try {
      if (!accessStatus) {
        throw new Error('Cannot toggle access - invalid initial status!')
      }

      const newAccessStatus =
        accessStatus === AccessStatus.Deleted
          ? AccessStatus.Public
          : AccessStatus.Deleted

      if (onClick) {
        onClick({ newValue: newAccessStatus })
      }

      const extraFields = {}

      if (newAccessStatus === AccessStatus.Deleted && onOverrideDelete) {
        onOverrideDelete(null)
        return
      }

      if (newAccessStatus === AccessStatus.Public && onOverrideUndelete) {
        onOverrideUndelete()
        return
      }

      await save({
        accessstatus: newAccessStatus,
        ...extraFields,
      })

      if (onDone) {
        onDone()
      }
    } catch (err) {
      console.error('Failed to toggle deleted status', err)
      handleError(err)
    }
  }

  const onClickUpdate = async () => {
    try {
      if (onOverrideUpdateReason) {
        onOverrideUpdateReason(selectedReason)
        return
      }

      await save({
        deletionreason: selectedReason,
      })

      if (onDone) {
        onDone()
      }
    } catch (err) {
      console.error('Failed to update reason', err)
      handleError(err)
    }
  }

  const hasChangedReason =
    selectedReason !== existingDeletionReason &&
    existingDeletionReason !== undefined

  return (
    <ButtonGroup>
      <Button
        onClick={toggle}
        icon={<DeleteIcon />}
        size="small"
        color="secondary"
        hollow={false}
        {...buttonProps}>
        {accessStatus === AccessStatus.Deleted
          ? 'Un-delete'
          : `Delete${hasChangedReason ? ` (${selectedReason})` : ''}`}
      </Button>
    </ButtonGroup>
  )
}

export default DeleteButton
