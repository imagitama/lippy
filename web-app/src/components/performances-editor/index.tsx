import React, {
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'

import { removeByIndex } from '@/utils'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Performer as PerformerIcon,
} from '@/icons'
import { getFriendlyDuration } from '@/utils/dates'

import { Event } from 'shared/modules/events'
import TextInput from '@/components/text-input'
import Button from '@/components/button'
import DialogButton from '../dialog-button'
import Heading from '../heading'
import FormControls from '../form-controls'
import SearchForIdForm from '../search-for-id-form'
import {
  CollectionNames as PerformancesCollectionNames,
  Performance,
  PerformanceFields,
} from 'shared/modules/performances'
import {
  CollectionNames as PerformersCollectionNames,
  Performer,
} from 'shared/modules/performers'
import HintText from '../hint-text'
import useDataStoreItem from '@/hooks/useDataStoreItem'
import LoadingIndicator from '../loading-indicator'
import ErrorMessage from '../error-message'
import WarningMessage from '../warning-message'
import useDatabaseQuery, { Operators } from '@/hooks/useDatabaseQuery'
import { insertRecord, updateRecord } from '@/data-store'
import { client } from '@/supabase'
import { handleError } from '@/error-handling'
import { stripMetaFields } from '@/utils/performances'
import { useStateGetter } from '@/hooks/useStateGetter'
import { AccessStatus } from 'shared/modules/common'
import TagsInput from '../tags-input'
import { commonGenres, lessCommonGenres } from '@/tags'

const SLOT_MS = 30 * 30 * 1000
const SLOT_WIDTH_PX = 200 // px per 30-min slot
const THIN_MS = 1 * 60 * 1000
const THIN_PER_SLOT = SLOT_MS / THIN_MS // 6
const THIN_WIDTH_PX = SLOT_WIDTH_PX / THIN_PER_SLOT

const Root = styled.div`
  width: 100%;
  overflow-x: auto;
  min-width: 0;
  font-size: 75%;
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
  font-weight: bold;
  user-select: none;
  line-height: 1;
`
const StartDate = styled(DateOutput)`
  margin-left: 15px;
`
const EndDate = styled(DateOutput)`
  margin-right: 15px;
`

const PerformerLabel = styled.div`
  width: 100%;
  margin: 5px 0 0 15px;
  text-align: center;
`

const PerformerName = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 2px;
  }
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

export const PerformerNameById = ({
  id,
  customName,
}: {
  id: string | null
  customName: string | null
}) => {
  const [isLoading, lastErrorCode, performer] = useDataStoreItem<Performer>(
    PerformersCollectionNames.Performers,
    id ?? false,
    {
      queryName: `performer_${id}`,
    }
  )
  if (isLoading) return <LoadingIndicator message="Loading performer..." />
  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load performer
      </ErrorMessage>
    )
  return (
    <PerformerName>
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
    </PerformerName>
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
  indexes: number[]
  startX: number
  originMs: number // the edge's time when the drag began
  otherMs: number // the opposite edge's time (stays fixed)
  lowerMs: number // earliest the dragged edge may go (event start / prev perf end)
  upperMs: number // latest the dragged edge may go (event end / next perf start)
}

const usePerformancesEditing = (): [
  boolean,
  string | null,
  Performance[] | null | false,
  (
    eventId: string,
    newPerfs: (Performance | PerformanceFields)[]
  ) => Promise<void>
] => {
  const [isLoading, setIsLoading] = useState(false)
  const [lastErrorCode, setLastErrorCode] = useState<string | null>(null)
  const [results, setResults] = useState<Performance[] | null | false>(null)

  const createOrEditAll = async (
    eventId: string,
    perfs: (Performance | PerformanceFields)[]
  ) => {
    console.debug(`usePerformancesEditing.createOrEditAll`, eventId, perfs)

    try {
      setIsLoading(true)
      setLastErrorCode(null)

      for (const perf of perfs) {
        if (perf.id) {
          await updateRecord<Performance>(
            client,
            PerformancesCollectionNames.Performances,
            perf.id,
            {
              ...stripMetaFields(perf),
            }
          )
        } else {
          if (!eventId) throw new Error('Cannot insert without an event ID')

          await insertRecord<PerformanceFields, Performance>(
            client,
            PerformancesCollectionNames.Performances,
            {
              ...perf,
              eventid: eventId,
            }
          )
        }
      }

      setIsLoading(false)
      setLastErrorCode(null)
    } catch (err) {
      console.error(err)
      handleError(err)
      setLastErrorCode((err as Error).constructor.name)
    }
  }

  return [isLoading, lastErrorCode, results, createOrEditAll]
}

const PerformancesEditor = ({
  event,
  addOnSaveCallback,
  eventStartsAt,
  eventEndsAt,
}: {
  event: Event | false | null
  addOnSaveCallback: (callback: (event: Event) => void) => void
  eventStartsAt: string
  eventEndsAt: string
}) => {
  const [value, setValue, getValue] = useStateGetter<
    (Performance | PerformanceFields)[]
  >([])

  const groups = useMemo(() => {
    const map = new Map<
      string,
      { startsat: string; endsat: string; indexes: number[] }
    >()

    // console.debug(
    //   `REGENERATE`,
    //   value.filter((perf) => perf.accessstatus !== AccessStatus.Deleted)
    // )

    value
      .filter((perf) => perf.accessstatus !== AccessStatus.Deleted)
      .forEach((perf, idx) => {
        const key = `${new Date(perf.startsat).getTime()}-${new Date(
          perf.endsat
        ).getTime()}`
        const existing = map.get(key)
        if (existing) existing.indexes.push(idx)
        else
          map.set(key, {
            startsat: perf.startsat,
            endsat: perf.endsat,
            indexes: [idx],
          })
      })

    return Array.from(map.values())
  }, [JSON.stringify(value)])

  const onChange = (newPerfs: (Performance | PerformanceFields)[]) => {
    console.debug(`PerformancesEditor.onChange`, value, newPerfs)
    setValue(newPerfs)
  }

  const [isSaving, lastErrorCodeSaving, results, createOrEditAll] =
    usePerformancesEditing()

  const [isLoadingExisting, lastErrorCodeExisting, existingPerfs] =
    useDatabaseQuery<Performance>(
      PerformancesCollectionNames.Performances,
      event
        ? [
            ['eventid', Operators.EQUALS, event.id],
            ['accessstatus', Operators.NOT_EQUALS, AccessStatus.Deleted],
          ]
        : false
    )

  const drag = useRef<DragState | null>(null)

  useEffect(() => {
    if (!existingPerfs) return

    onChange(existingPerfs)

    addOnSaveCallback((event) => {
      console.debug(
        `event has been saved (${event.id}) now saving performances...`
      )
      createOrEditAll(event.id, getValue())
    })
  }, [JSON.stringify(existingPerfs)])

  if (isLoadingExisting)
    return <LoadingIndicator message="Loading performances..." />
  if (lastErrorCodeExisting !== null)
    return (
      <ErrorMessage errorCode={lastErrorCodeExisting}>
        Failed to load performances
      </ErrorMessage>
    )

  if (isSaving) return <LoadingIndicator message="Saving performances..." />
  if (lastErrorCodeSaving !== null)
    return (
      <ErrorMessage errorCode={lastErrorCodeSaving}>
        Failed to save performances
      </ErrorMessage>
    )

  const slots = getSlots(eventStartsAt, eventEndsAt)

  if (!slots.length)
    return (
      <ErrorMessage>
        You cannot configure any performances: your event has weird start or end
        dates
      </ErrorMessage>
    )

  if (slots.length > 1000)
    return (
      <ErrorMessage>
        You cannot configure any performances: your event duration is way too
        long
      </ErrorMessage>
    )

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
    if (startsAt >= eventEndsAt) {
      console.warn('no room left!')
      return
    }

    const proposedEndsAt = addMins(startsAt, mins)

    // clamp so the new slot never runs past the event end
    const endsAt = proposedEndsAt > eventEndsAt ? eventEndsAt : proposedEndsAt

    onChange(
      // @ts-ignore TODO: fix typings
      value.concat([
        {
          // eventid: event ? event.id : undefined, // to populate
          performerid: null,
          name: null,
          startsat: startsAt,
          endsat: endsAt,
          genres: [],
        },
      ])
    )
  }

  const thinSlots = Array.from(
    { length: slots.length * THIN_PER_SLOT },
    (_, i) => new Date(timelineStart + i * THIN_MS)
  )

  const dupeAlongsideByIdx = (idx: number) => {
    console.debug(`dupeAlongsideByIdx`, idx)

    const source = value[idx]

    const copy = {
      startsat: source.startsat,
      endsat: source.endsat,
    } as PerformanceFields

    const newVal = [...value.slice(0, idx + 1), copy, ...value.slice(idx + 1)]

    onChange(newVal)
  }

  const deleteByIdx = (idx: number) => {
    console.debug(`deleteByIdx`, idx)

    const item = value[idx]
    if (!item) return

    if (!('id' in item) || !item.id) {
      // never saved so just drop from array
      onChange(removeByIndex(value, idx))
    } else {
      // already persisted so mark as deleted
      onChange(
        value.map((perf, i) =>
          i === idx ? { ...perf, accessstatus: AccessStatus.Deleted } : perf
        )
      )
    }
  }

  const updateItemAtIdx = (idx: number, patch: Partial<Performance>) => {
    console.debug(`updateItemAtIdx`, idx, { patch })
    onChange(value.map((item, i) => (i === idx ? { ...item, ...patch } : item)))
  }

  const updateField = (
    idx: number,
    fieldName: keyof PerformanceFields,
    val: any
  ) => updateItemAtIdx(idx, { [fieldName]: val })

  const updateFields = (indexes: number[], edge: Edge, date: string) => {
    console.debug(`updateFields`, { indexes, edge, date })
    setValue((prev) =>
      prev.map((p, i) => (indexes.includes(i) ? { ...p, [edge]: date } : p))
    )
  }

  const pxToMs = (px: number) => (px / SLOT_WIDTH_PX) * SLOT_MS

  const snapSmallColumn = (ms: number) =>
    Math.round((ms - timelineStart) / THIN_MS) * THIN_MS + timelineStart

  const eventStartsAtMs = new Date(eventStartsAt).getTime()
  const eventEndsAtMs = new Date(eventEndsAt).getTime()

  const dragProps = (edge: Edge, indexes: number[]) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)

      const otherEdge: Edge = edge === 'startsat' ? 'endsat' : 'startsat'
      // group members share identical times, so the first one is representative
      const perf = value[indexes[0]]
      const perfStart = new Date(perf.startsat).getTime()
      const perfEnd = new Date(perf.endsat).getTime()

      let lowerMs = eventStartsAtMs
      let upperMs = eventEndsAtMs
      value.forEach((other, i) => {
        if (indexes.includes(i)) return // skip the whole group, not just one item
        const otherStart = new Date(other.startsat).getTime()
        const otherEnd = new Date(other.endsat).getTime()
        if (otherEnd <= perfStart) lowerMs = Math.max(lowerMs, otherEnd)
        if (otherStart >= perfEnd) upperMs = Math.min(upperMs, otherStart)
      })

      drag.current = {
        edge,
        indexes,
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
        ms = Math.max(d.lowerMs, Math.min(ms, d.otherMs - THIN_MS))
      } else {
        ms = Math.min(d.upperMs, Math.max(ms, d.otherMs + THIN_MS))
      }
      const date = new Date(ms).toISOString()
      updateFields(d.indexes, d.edge, date)
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
                }}
              />
            </EventRow>
            {groups.map((group, idx) => {
              const left = msToPx(
                new Date(group.startsat).getTime() - timelineStart
              )
              const width = msToPx(
                new Date(group.endsat).getTime() -
                  new Date(group.startsat).getTime()
              )
              return (
                <PerformanceCell key={idx} style={{ left, width }}>
                  <LeftDragHandle {...dragProps('startsat', group.indexes)} />
                  <StartDate>{getTimeRowLabel(group.startsat)}</StartDate>
                  <PerformerLabel>
                    <Duration>
                      {getFriendlyDuration(group.startsat, group.endsat)}
                    </Duration>
                    {group.indexes.map((idx) => {
                      const perf = value[idx]
                      return (
                        <div>
                          <PerformerNameById
                            id={perf.performerid}
                            customName={perf.name}
                          />
                          <div>
                            <Button
                              size="small"
                              onClick={() => deleteByIdx(idx)}
                              icon={<DeleteIcon />}
                              title="Remove Performance"
                              color="secondary"
                            />{' '}
                            <DialogButton
                              size="small"
                              icon={<EditIcon />}
                              color="secondary"
                              title="Configure Performer"
                              dialog={({ close }) => (
                                <>
                                  <Heading variant="h3" noTopMargin>
                                    Performer Name
                                  </Heading>
                                  <SearchForIdForm
                                    collectionName={
                                      PerformersCollectionNames.Performers
                                    }
                                    fieldAsLabel="name"
                                    onClickWithIdAndDetails={(id, details) => {
                                      updateField(idx, 'performerid', id)
                                    }}
                                  />
                                  or
                                  <br />
                                  <TextInput
                                    size="small"
                                    label="Custom Performer Name"
                                    value={perf.name || ''}
                                    onChange={(e) =>
                                      updateField(idx, 'name', e.target.value)
                                    }
                                  />
                                  <br />
                                  <HintText>
                                    (only use this if you can't find the
                                    performer)
                                  </HintText>
                                  <Heading variant="h3" noTopMargin>
                                    Genres
                                  </Heading>
                                  <TagsInput
                                    currentTags={perf.genres}
                                    onChange={(newGenres) =>
                                      updateField(idx, 'genres', newGenres)
                                    }
                                    suggestedTags={{
                                      Common: commonGenres,
                                      'Less Common': lessCommonGenres,
                                    }}
                                  />
                                  <FormControls>
                                    <Button onClick={close}>Done</Button>
                                  </FormControls>
                                </>
                              )}
                            />{' '}
                            <Button
                              size="small"
                              onClick={() => dupeAlongsideByIdx(idx)}
                              icon={<PersonAddAlt1Icon />}
                              title="Add 2nd Performer"
                              color="secondary"></Button>
                          </div>
                        </div>
                      )
                    })}
                  </PerformerLabel>
                  <EndDate>{getTimeRowLabel(group.endsat)}</EndDate>
                  <RightDragHandle {...dragProps('endsat', group.indexes)} />
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
