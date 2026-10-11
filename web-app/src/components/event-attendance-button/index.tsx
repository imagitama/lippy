import React from 'react'
import CheckIcon from '@mui/icons-material/Check'

import { handleError } from '@/error-handling'
import {
  AttendanceStatus,
  CollectionNames,
  EventAttendance,
  FullEventAttendance,
} from 'shared/modules/events'

import useDataStoreEdit from '@/hooks/useDataStoreEdit'
import useIsLoggedIn from '@/hooks/useIsLoggedIn'
import useDataStoreCreate from '@/hooks/useDataStoreCreate'

import ErrorMessage from '@/components/error-message'
import Button from '@/components/button'
import useDataStoreEditOrCreate from '@/hooks/useDataStoreEditOrCreate'
import useDataStoreItem from '@/hooks/useDataStoreItem'
import useDatabaseQuery, { Operators } from '@/hooks/useDatabaseQuery'

const EventAttendenceButton = ({
  eventId,
  myAttendance = undefined,
  onDone = undefined,
}: {
  eventId: string
  myAttendance?: FullEventAttendance
  onDone?: () => void
}) => {
  const [, , myFetchedAttendance, hydrate] = useDatabaseQuery<EventAttendance>(
    CollectionNames.EventAttendance,
    myAttendance ? false : [['eventid', Operators.EQUALS, eventId]]
  )
  const myActualAttendance: EventAttendance | null =
    myAttendance || myFetchedAttendance?.[0] || null
  const isLoggedIn = useIsLoggedIn()
  const [isSaving, , lastErrorCode, saveOrCreate] =
    useDataStoreEditOrCreate<EventAttendance>(
      CollectionNames.EventAttendance,
      myActualAttendance ? myActualAttendance.id : false,
      {
        uniqueConstraintFields: ['event', 'createdby'], // CONSTRAINT unique_only UNIQUE (event, createdby)
      }
    )

  const currentStatus = myActualAttendance
    ? myActualAttendance.status
    : undefined

  if (lastErrorCode !== null) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to save your attendance
      </ErrorMessage>
    )
  }

  const onClickStatus = async (statusClickedOn: AttendanceStatus) => {
    try {
      const statusToSave =
        statusClickedOn === currentStatus
          ? AttendanceStatus.Abstain
          : statusClickedOn

      await saveOrCreate(
        myActualAttendance
          ? {
              id: myActualAttendance.id,
              eventid: eventId,
              status: statusToSave,
            }
          : {
              eventid: eventId,
              status: statusToSave,
            }
      )

      if (!myAttendance) hydrate()

      if (onDone) {
        onDone()
      }
    } catch (err) {
      console.error('Failed to toggle deleted status', err)
      handleError(err)
    }
  }

  return (
    <>
      <Button
        color="secondary"
        onClick={() => onClickStatus(AttendanceStatus.Accepted)}
        icon={
          currentStatus === AttendanceStatus.Accepted ? (
            <CheckIcon />
          ) : undefined
        }
        isDisabled={!isLoggedIn || isSaving}>
        Attend
      </Button>{' '}
      <Button
        color="secondary"
        onClick={() => onClickStatus(AttendanceStatus.Maybe)}
        icon={
          currentStatus === AttendanceStatus.Maybe ? <CheckIcon /> : undefined
        }
        isDisabled={!isLoggedIn || isSaving}>
        Maybe
      </Button>{' '}
      <Button
        color="secondary"
        onClick={() => onClickStatus(AttendanceStatus.Declined)}
        icon={
          currentStatus === AttendanceStatus.Declined ? (
            <CheckIcon />
          ) : undefined
        }
        isDisabled={!isLoggedIn || isSaving}>
        Decline
      </Button>
    </>
  )
}

export default EventAttendenceButton
