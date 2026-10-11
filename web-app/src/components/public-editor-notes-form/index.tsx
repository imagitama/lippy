import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import SaveIcon from '@mui/icons-material/Save'

import { CommonMetaRecordFields } from '@/data-store'
import { handleError } from '@/error-handling'
import { MetaRecord } from 'shared/modules/common'

import useDataStoreEdit from '@/hooks/useDataStoreEdit'
import useDataStoreItem from '@/hooks/useDataStoreItem'

import Button from '@/components/button'
import TextInput from '@/components/text-input'
import LoadingIndicator from '@/components/loading-indicator'
import FormControls from '@/components/form-controls'
import ErrorMessage from '@/components/error-message'

const useStyles = makeStyles({
  label: {
    fontSize: '75%',
    display: 'block',
  },
})

const PublicEditorNotesForm = ({
  id,
  metaCollectionName,
  existingEditorNotes = undefined,
  onClick = undefined,
  onDone = undefined,
}: {
  id: string
  metaCollectionName: string
  existingEditorNotes?: string | null
  onClick?: (result: { modNotes: string | null }) => void
  onDone?: () => void
}) => {
  const [isLoadingMeta, lastErrorCodeLoadingMeta, metaRecord] =
    useDataStoreItem<CommonMetaRecordFields>(
      metaCollectionName,
      existingEditorNotes !== undefined ? false : id,
      { queryName: 'editor-notes-form' }
    )
  const [isSaving, , lastErrorCodeSavingMeta, saveMetaRecord] =
    useDataStoreEdit<MetaRecord>(metaCollectionName, id)

  const [newEditorNotes, setNewEditorNotes] = useState<string | null>(
    existingEditorNotes || ''
  )
  const classes = useStyles()

  useEffect(() => {
    if (!metaRecord || existingEditorNotes) {
      return
    }

    setNewEditorNotes(metaRecord.modnotes)
  }, [metaRecord !== null])

  if (
    isLoadingMeta ||
    isSaving ||
    (existingEditorNotes === undefined && !metaRecord)
  ) {
    return (
      <LoadingIndicator
        message={
          isLoadingMeta || !metaRecord ? 'Loading notes...' : 'Saving notes...'
        }
      />
    )
  }

  if (lastErrorCodeLoadingMeta !== null) {
    return (
      <ErrorMessage errorCode={lastErrorCodeLoadingMeta}>
        Failed to load meta
      </ErrorMessage>
    )
  }

  if (lastErrorCodeSavingMeta !== null) {
    return (
      <ErrorMessage errorCode={lastErrorCodeSavingMeta}>
        Failed to save meta
      </ErrorMessage>
    )
  }

  const onSaveBtnClick = async () => {
    try {
      if (onClick) {
        onClick({ modNotes: newEditorNotes })
      }

      await saveMetaRecord({
        modnotes: newEditorNotes || '',
      })

      if (onDone) {
        onDone()
      }
    } catch (err) {
      console.error('Failed to edit asset with editor notes', err)
      handleError(err)
    }
  }

  return (
    <>
      <TextInput
        fullWidth
        multiline
        minRows={2}
        value={newEditorNotes}
        onChange={(e) => setNewEditorNotes(e.target.value)}
        size="small"
      />
      <FormControls>
        <Button
          onClick={onSaveBtnClick}
          size="small"
          color="secondary"
          hollow={false}
          icon={<SaveIcon />}>
          Save
        </Button>
      </FormControls>
    </>
  )
}

export default PublicEditorNotesForm
