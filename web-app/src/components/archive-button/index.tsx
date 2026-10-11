import React, { useState } from 'react'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import ButtonGroup from '@mui/material/ButtonGroup'

import useDataStoreEdit from '@/hooks/useDataStoreEdit'
import { handleError } from '@/error-handling'
import useDataStoreItem from '@/hooks/useDataStoreItem'
import { AccessStatus, MetaRecord } from 'shared/modules/common'

import ButtonDropdown from '@/components/button-dropdown'
import LoadingIndicator from '@/components/loading-indicator'
import Button from '@/components/button'

type ArchivedReason = any

// TODO: update <ArchiveButton /> to use this
export const ArchiveButtonBase = ({
  existingAccessStatus,
  existingArchivedReason,
  onArchive,
  onUnarchive,
  onReasonChange,
}: {
  existingAccessStatus: AccessStatus | null
  existingArchivedReason?: ArchivedReason | null
  onArchive: (reason: ArchivedReason | null) => void
  onUnarchive: () => void
  onReasonChange: (reason: ArchivedReason | null) => void
}) => {
  const [selectedReason, setSelectedReason] = useState<ArchivedReason | null>(
    existingArchivedReason || null
  )

  const onClickButton = () => {
    if (existingAccessStatus === AccessStatus.Archived) {
      onUnarchive()
    } else {
      onArchive(selectedReason)
    }
  }

  const hasChangedReason = selectedReason !== existingArchivedReason

  const onClickUpdate = () => {
    onReasonChange(selectedReason)
  }

  return (
    <ButtonGroup>
      <Button
        onClick={onClickButton}
        icon={<BusinessCenterIcon />}
        size="small"
        color="secondary"
        hollow={false}>
        {existingAccessStatus === AccessStatus.Archived
          ? 'Un-archive'
          : `Archive${hasChangedReason ? ` (${selectedReason})` : ''}`}
      </Button>
    </ButtonGroup>
  )
}

const ArchiveButton = ({
  id,
  metaCollectionName,
  existingAccessStatus,
  existingArchivedReason,
  onClick,
  onDone,
}: {
  id: string
  metaCollectionName: string
  existingAccessStatus?: AccessStatus
  existingArchivedReason?: ArchivedReason | null
  onClick?: ({ newValue }: { newValue: AccessStatus }) => void
  onDone?: () => void
}) => {
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
  const [selectedReason, setSelectedReason] = useState<ArchivedReason | null>(
    existingArchivedReason || null
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

  const onClickButton = async () => {
    try {
      if (!accessStatus) {
        throw new Error('Cannot toggle access - invalid initial status!')
      }

      const newAccessStatus =
        accessStatus === AccessStatus.Archived
          ? AccessStatus.Public
          : AccessStatus.Archived

      if (onClick) {
        onClick({ newValue: newAccessStatus })
      }

      const extraFields = {}

      await save({
        accessstatus: newAccessStatus,
        ...extraFields,
      })

      if (onDone) {
        onDone()
      }
    } catch (err) {
      console.error('Failed to toggle access status', err)
      handleError(err)
    }
  }

  const hasChangedReason = selectedReason !== existingArchivedReason

  const onClickUpdate = async () => {
    try {
      await save({
        archivedreason: selectedReason,
      })

      if (onDone) {
        onDone()
      }
    } catch (err) {
      console.error('Failed to update reason', err)
      handleError(err)
    }
  }

  return (
    <ButtonGroup>
      <Button
        onClick={onClickButton}
        icon={<BusinessCenterIcon />}
        size="small"
        color="secondary"
        hollow={false}
        title={
          accessStatus === AccessStatus.Archived
            ? 'Does not notify anyone, starts showing in search results'
            : 'Notifies publisher, hides in search results'
        }>
        {accessStatus === AccessStatus.Archived
          ? 'Un-archive'
          : `Archive${hasChangedReason ? ` (${selectedReason})` : ''}`}
      </Button>
    </ButtonGroup>
  )
}

export default ArchiveButton
