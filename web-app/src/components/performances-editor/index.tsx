import React, { PointerEvent, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import KeyboardIcon from '@mui/icons-material/Keyboard'

import { removeByIndex } from '@/utils'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Performer as PerformerIcon,
} from '@/icons'
import { getFriendlyDuration } from '@/utils/dates'

import { Performance } from 'shared/modules/events'
import TextInput from '@/components/text-input'
import Button from '@/components/button'
import DialogButton from '../dialog-button'
import Heading from '../heading'
import FormControls from '../form-controls'
import SearchForIdForm from '../search-for-id-form'
import { CollectionNames, Performer } from 'shared/modules/performers'
import HintText from '../hint-text'
import useDataStoreItem from '@/hooks/useDataStoreItem'
import LoadingIndicator from '../loading-indicator'
import ErrorMessage from '../error-message'
import WarningMessage from '../warning-message'

const SLOT_MS = 30 * 30 * 1000
const SLOT_WIDTH_PX = 200 // px per 30-min slot
const THIN_MS = 1 * 60 * 1000
const THIN_PER_SLOT = SLOT_MS / THIN_MS // 6
const THIN_WIDTH_PX = SLOT_WIDTH_PX / THIN_PER_SLOT

const Root = styled.div`
  width: 100%;
  overflow-x: auto;
  min-width: 0;
`
const Container = styled.div``

const DateRow = styled.div`
  height: 30px;
  background-color: rgb(50, 50, 50);
  border-bottom: 1px solid rgb(100, 100, 100);
  display: flex;
  align-items: center;
`

const DateRowLabel = styled.div`
  font-weight: bold;
  padding: 6px;
`

const TimeRow = styled.div`
  height: 30px;
  display: flex;
  background-color: rgb(50, 50, 50);
  border-bottom: 1px solid rgb(100, 100, 100);
`

const TimeRowCell = styled.div`
  height: 30px;
  width: 200px;
  border-right: 1px solid rgb(100, 100, 100);
  padding: 6px;
`

const EventRow = styled.div`
  position: absolute;
  top: 4px;
  left: 0;
  width: 100%;
  height: 100%;
`

const EventCell = styled.div`
  position: absolute;
  height: 108px;
  top: 2px;
  left: 2px;
  border-radius: 5px;
  background-color: rgb(75, 75, 75);
`

const Body = styled.div`
  position: relative;
  height: 200px;
`

const Columns = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
`

const Column = styled.div`
  width: ${SLOT_WIDTH_PX}px;
  height: 100%;
  border-right: 1px solid rgb(100, 100, 100);
`

const PerformanceCell = styled.div`
  height: 100px;
  background-color: rgb(100, 100, 100);
  position: absolute;
  top: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
`

const DragHandle = styled.div`
  width: 10px;
  border-radius: 5px;
  height: 40px;
  background-color: rgb(150, 150, 150);
  position: absolute;
  top: 30px;
  cursor: grab;
  touch-action: none;
  transition: background-color 0.15s;

  /* two grip lines */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    bottom: 10px;
    width: 2px;
    border-radius: 1px;
    background-color: rgb(200, 200, 200);
  }
  &::before {
    left: 2px;
  }
  &::after {
    right: 2px;
  }

  &:hover {
    background-color: rgb(175, 175, 175);
  }
  &:active {
    cursor: grabbing;
    background-color: rgb(80, 80, 80);
  }
`
const LeftDragHandle = styled(DragHandle)`
  left: 2px;
`
const RightDragHandle = styled(DragHandle)`
  right: 2px;
`

const DateOutput = styled.div`
  font-size: 75%;
  font-weight: bold;
  user-select: none;
`
const StartDate = styled(DateOutput)`
  margin-left: 15px;
`
const EndDate = styled(DateOutput)`
  margin-right: 15px;
`

const PerformerName = styled.div`
  width: 100%;
  margin: 5px 0 0 15px;
  text-align: center;
`
const Controls = styled.div`
  position: relative;
  height: 50px;
  & > *:first-child {
    position: absolute;
    top: 0;
    left: 0;
  }
  & > *:last-child {
    position: absolute;
    top: 0;
    right: 0;
  }
`

const ThinColumns = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
`

const ThinColumn = styled.div`
  flex: 0 0 ${THIN_WIDTH_PX}px;
  border-right: 1px solid rgb(60, 60, 60);
`

const Duration = styled.div`
  text-align: center;
  font-weight: bold;
  user-select: none;
`

const PerformerNameById = ({
  id,
  customName,
}: {
  id: string | null
  customName: string | null
}) => {
  const [isLoading, lastErrorCode, performer] = useDataStoreItem<Performer>(
    CollectionNames.Performers,
    id ?? false
  )
  if (isLoading) return <LoadingIndicator message="Loading performer..." />
  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load performer
      </ErrorMessage>
    )
  return (
    <>
      {performer ? (
        <>
          <PerformerIcon /> {performer.name}
        </>
      ) : customName ? (
        <>
          <KeyboardIcon /> {customName}
        </>
      ) : (
        '(no name yet)'
      )}
    </>
  )
}

const getDateRowLabel = (date: string): string =>
  new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) // "12 Oct"
const getTimeRowLabel = (date: string): string =>
  new Date(date).toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) // "00:00"

function getSlots(eventStartAt: string, eventEndAt: string): Date[] {
  const start = Math.floor(new Date(eventStartAt).getTime() / SLOT_MS) * SLOT_MS
  const end = Math.ceil(new Date(eventEndAt).getTime() / SLOT_MS) * SLOT_MS
  const slots: Date[] = []

  for (let t = start; t < end; t += SLOT_MS) {
    slots.push(new Date(t))
  }
  return slots
}

const msToPx = (ms: number) => (ms / SLOT_MS) * SLOT_WIDTH_PX

const addMins = (date: string, mins: number): string =>
  new Date(new Date(date).getTime() + mins * 60 * 1000).toISOString()

type Edge = 'startsat' | 'endsat'

interface DragState {
  edge: Edge
  startX: number
  originMs: number // the edge's time when the drag began
  otherMs: number // the opposite edge's time (stays fixed)
  lowerMs: number // earliest the dragged edge may go (event start / prev perf end)
  upperMs: number // latest the dragged edge may go (event end / next perf start)
}

const PerformancesEditor = ({
  value,
  onChange,
  eventStartsAt,
  eventEndsAt,
}: {
  value: Performance[]
  onChange: (newVal: Performance[]) => void
  eventStartsAt: string
  eventEndsAt: string
}) => {
  const drag = useRef<DragState | null>(null)

  const slots = getSlots(eventStartsAt, eventEndsAt)

  if (!slots.length) return <>Not enough slots</>

  const timelineStart = slots[0].getTime()
  const totalWidth = slots.length * SLOT_WIDTH_PX
  const eventStart = new Date(eventStartsAt).getTime()
  const eventEnd = new Date(eventEndsAt).getTime()

  const lastEndsAt =
    value.length > 0 ? value[value.length - 1].endsat : eventStartsAt

  const isAbleToAddRight = lastEndsAt < eventEndsAt

  const onClickAddRight = (mins: number) => {
    const startsAt =
      value.length > 0 ? value[value.length - 1].endsat : eventStartsAt

    // no room left in the event
    if (startsAt >= eventEndsAt) return

    const proposedEndsAt = addMins(startsAt, mins)

    // clamp so the new slot never runs past the event end
    const endsAt = proposedEndsAt > eventEndsAt ? eventEndsAt : proposedEndsAt

    onChange(
      value.concat([
        {
          startsat: startsAt,
          endsat: endsAt,
          performerid: null,
          performername: '',
        },
      ])
    )
  }

  const thinSlots = Array.from(
    { length: slots.length * THIN_PER_SLOT },
    (_, i) => new Date(timelineStart + i * THIN_MS)
  )

  const deleteByIdx = (idx: number) => onChange(removeByIndex(value, idx))

  const updateItemAtIdx = (idx: number, patch: Partial<Performance>) =>
    onChange(value.map((item, i) => (i === idx ? { ...item, ...patch } : item)))

  const updateField = (idx: number, fieldName: string, val: any) =>
    updateItemAtIdx(idx, { [fieldName]: val })

  const pxToMs = (px: number) => (px / SLOT_WIDTH_PX) * SLOT_MS

  const snapSmallColumn = (ms: number) =>
    Math.round((ms - timelineStart) / THIN_MS) * THIN_MS + timelineStart

  const eventStartsAtMs = new Date(eventStartsAt).getTime()
  const eventEndsAtMs = new Date(eventEndsAt).getTime()

  const dragProps = (edge: Edge, perf: Performance, idx: number) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)
      const otherEdge: Edge = edge === 'startsat' ? 'endsat' : 'startsat'
      const perfStart = new Date(perf.startsat).getTime()
      const perfEnd = new Date(perf.endsat).getTime()

      let lowerMs = eventStartsAtMs
      let upperMs = eventEndsAtMs
      value.forEach((other, i) => {
        if (i === idx) return
        const otherStart = new Date(other.startsat).getTime()
        const otherEnd = new Date(other.endsat).getTime()
        if (otherEnd <= perfStart) lowerMs = Math.max(lowerMs, otherEnd)
        if (otherStart >= perfEnd) upperMs = Math.min(upperMs, otherStart)
      })

      drag.current = {
        edge,
        startX: e.clientX,
        originMs: new Date(perf[edge]).getTime(),
        otherMs: new Date(perf[otherEdge]).getTime(),
        lowerMs,
        upperMs,
      }
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const d = drag.current
      if (!d) return
      let ms = snapSmallColumn(d.originMs + pxToMs(e.clientX - d.startX))
      if (d.edge === 'startsat') {
        // can't pass the end (keep at least one slot) or the timeline start
        ms = Math.max(d.lowerMs, Math.min(ms, d.otherMs - THIN_MS))
      } else {
        // can't go past the event end or within one slot of the start
        ms = Math.min(d.upperMs, Math.max(ms, d.otherMs + THIN_MS))
      }
      updateField(idx, edge, new Date(ms).toISOString())
    },
    onPointerUp: () => {
      drag.current = null
    },
    onPointerCancel: () => {
      drag.current = null
    },
  })

  const isFirstPerfOutOfBounds =
    value.length > 0 &&
    (new Date(value[0].startsat) < new Date(eventStartsAt) ||
      new Date(value[0].endsat) > new Date(eventEndsAt))

  const onRealignPerfs = () => {
    if (value.length === 0) return

    const oldFirstStart = new Date(value[0].startsat).getTime()
    const newEventStart = new Date(eventStartsAt).getTime()
    const offset = newEventStart - oldFirstStart

    const updatedValue = value.map((perf) => {
      const perfStart = new Date(perf.startsat).getTime()
      const perfEnd = new Date(perf.endsat).getTime()

      return {
        ...perf,
        startsat: new Date(perfStart + offset).toISOString(),
        endsat: new Date(perfEnd + offset).toISOString(),
      }
    })

    onChange(updatedValue)
  }

  return (
    <>
      {isFirstPerfOutOfBounds && (
        <WarningMessage
          controls={
            <Button onClick={() => onRealignPerfs()} color="secondary">
              Shift all performances to event start
            </Button>
          }>
          The first performance starts before or after the event. This only
          happens when someone changes the event start/end dates.
        </WarningMessage>
      )}
      <Root>
        <Container style={{ width: totalWidth }}>
          <DateRow>
            <DateRowLabel>{getDateRowLabel(eventStartsAt)}</DateRowLabel>
          </DateRow>
          <TimeRow>
            {slots.map((slot) => (
              <TimeRowCell key={slot.toISOString()}>
                {getTimeRowLabel(slot.toISOString())}
              </TimeRowCell>
            ))}
          </TimeRow>
          <Body>
            <ThinColumns>
              {thinSlots.map((slot) => (
                <ThinColumn key={slot.toISOString()} />
              ))}
            </ThinColumns>
            <Columns>
              {slots.map((slot) => (
                <Column key={slot.toISOString()} />
              ))}
            </Columns>
            <EventRow>
              <EventCell
                style={{
                  left: msToPx(eventStart - timelineStart),
                  width: msToPx(eventEnd - eventStart),
                }}></EventCell>
            </EventRow>
            {value.map((perf, idx) => {
              const left = msToPx(
                new Date(perf.startsat).getTime() - timelineStart
              )
              const width = msToPx(
                new Date(perf.endsat).getTime() -
                  new Date(perf.startsat).getTime()
              )
              return (
                <PerformanceCell key={idx} style={{ left, width }}>
                  <LeftDragHandle {...dragProps('startsat', perf, idx)} />
                  <StartDate>{getTimeRowLabel(perf.startsat)}</StartDate>
                  <PerformerName>
                    <Duration>
                      {getFriendlyDuration(perf.startsat, perf.endsat)}
                    </Duration>
                    <PerformerNameById
                      id={perf.performerid}
                      customName={perf.performername}
                    />
                    <div>
                      <Button
                        size="small"
                        onClick={() => deleteByIdx(idx)}
                        icon={<DeleteIcon />}
                        color="secondary"
                      />{' '}
                      <DialogButton
                        size="small"
                        icon={<EditIcon />}
                        color="secondary"
                        dialog={({ close }) => (
                          <>
                            <Heading variant="h3" noTopMargin>
                              Set Performer Name
                            </Heading>
                            <SearchForIdForm
                              collectionName={CollectionNames.Performers}
                              fieldAsLabel="name"
                              onClickWithIdAndDetails={(id, details) => {
                                updateField(idx, 'performerid', id)
                              }}
                            />
                            <br />
                            or
                            <br />
                            <br />
                            <TextInput
                              size="small"
                              label="Custom Performer Name"
                              value={perf.performername || ''}
                              onChange={(e) =>
                                updateField(
                                  idx,
                                  'performername',
                                  e.target.value
                                )
                              }
                            />
                            <br />
                            <HintText>
                              (only use this if you can't find the performer)
                            </HintText>
                            <FormControls>
                              <Button onClick={close}>Done</Button>
                            </FormControls>
                          </>
                        )}>
                        Set Name
                      </DialogButton>
                    </div>
                  </PerformerName>
                  <EndDate>{getTimeRowLabel(perf.endsat)}</EndDate>
                  <RightDragHandle {...dragProps('endsat', perf, idx)} />
                </PerformanceCell>
              )
            })}
          </Body>
        </Container>
      </Root>
      <Controls>
        <FormControls>
          <Button
            color="secondary"
            onClick={() => onClickAddRight(15)}
            icon={<AddIcon />}
            isDisabled={!isAbleToAddRight}>
            15 min slot
          </Button>
          <Button
            color="secondary"
            onClick={() => onClickAddRight(30)}
            icon={<AddIcon />}
            isDisabled={!isAbleToAddRight}>
            30 min slot
          </Button>
          <Button
            color="secondary"
            onClick={() => onClickAddRight(60)}
            icon={<AddIcon />}
            isDisabled={!isAbleToAddRight}>
            60 min slot
          </Button>
        </FormControls>
      </Controls>
    </>
  )
}

export default PerformancesEditor
