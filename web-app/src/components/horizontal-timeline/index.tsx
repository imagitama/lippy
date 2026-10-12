import React, {
  PointerEvent,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from '@emotion/styled'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { alpha, Theme } from '@mui/material/styles'
import HistoryIcon from '@mui/icons-material/History'

import { EventForList, Performance } from 'shared/modules/events'

import { useEventsFavoriting } from '@/hooks/useEventFavoriting'
import useEventFilters from '@/hooks/useEventFilters'

import { Refresh as RefreshIcon } from '@/icons'
import { mediaQueryForMobiles } from '@/media-queries'

import Button from '@/components/button'

import FilterButton from './components/filter-button'

export interface TimeRange {
  start: Date
  end: Date
}

export interface HorizontalTimelineProps {
  fill?: boolean
  initialDate?: Date
  events: EventForList[]
  /** Called when an event bar is clicked. */
  onEventClick?: (event: EventForList) => void
  /** Called when a performer bar is clicked. */
  onPerformanceClick?: (performance: Performance, event: EventForList) => void
  /**
   * Called when the user finishes dragging the timeline (and when they press
   * "Back to now") to fetch more data.
   */
  onRangeChange?: (range: TimeRange) => void
  /** Time shown on each side of the red "now" line, in ms. Default: 1 hour. */
  halfWindowMs?: number
  isLoading?: boolean
  hydrate?: () => void
}

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const TWO_HOUR_MS = HOUR_MS * 2
const WHEEL_SETTLE_DELAY_MS = 200

const DATE_ROW_HEIGHT_PX = 24
const HEADER_HEIGHT_PX = 32
const ROW_PAD_PX = 8
const EVENT_HEIGHT_PX = 42
const PERFORMANCE_HEIGHT_PX = 19
const NOW_LINE_WIDTH_PX = 3
const DRAG_THRESHOLD_PX = 4
const MIN_TICK_SPACING_PX = 45
const WHEEL_LINE_HEIGHT_PX = 16 // firefox reports wheel deltas in lines
const EVENT_GAP_MS = 10 * MINUTE_MS

const TICK_STEPS_MS = [
  30 * MINUTE_MS,
  HOUR_MS,
  2 * HOUR_MS,
  3 * HOUR_MS,
  6 * HOUR_MS,
  12 * HOUR_MS,
  24 * HOUR_MS,
]

const getTheme = (props: { theme?: object }) => props.theme as Theme

/** Props that position something along the time axis. */
interface PositionProps {
  leftPx: number
  widthPx: number
}

/** MUI components forward unknown props to the DOM, so strip ours. */
const OWN_PROPS = new Set([
  'leftPx',
  'widthPx',
  'isFaved',
  'isFilteredIn',
  'isClippedLeft',
  'isClippedRight',
])
const getShouldForwardProp = (prop: string) => !OWN_PROPS.has(prop)

const Root = styled.div<{ fill: boolean; isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: ${(p) => (p.fill ? 'calc(100vh - 30px)' : '100%')};
  overflow: hidden;
  border: 1px solid ${(p) => getTheme(p).palette.divider};
  border-radius: ${(p) => getTheme(p).shape.borderRadius}px;
  background-color: ${(p) => getTheme(p).palette.background.paper};
  cursor: ${(p) => (p.isDragging ? 'grabbing' : 'grab')};
  user-select: none;
  touch-action: pan-y;
`

const DateRow = styled.div`
  flex-shrink: 0;
  position: relative;
  height: ${DATE_ROW_HEIGHT_PX}px;
  overflow: hidden;
  border-bottom: 1px solid ${(p) => getTheme(p).palette.divider};
  background-color: ${(p) => alpha(getTheme(p).palette.text.primary, 0.08)};
`

const DayCell = styled.div<PositionProps & { isClippedLeft: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(p) => p.leftPx}px;
  width: ${(p) => p.widthPx}px;
  overflow: hidden;
  pointer-events: none;
  /* divider only where the day actually starts on screen */
  border-left: ${(p) =>
    p.isClippedLeft ? 'none' : `1px solid ${getTheme(p).palette.divider}`};
`

const DayLabel = styled(Typography)`
  padding-left: 6px;
  line-height: ${DATE_ROW_HEIGHT_PX}px;
  white-space: nowrap;
`

const AxisRow = styled.div`
  flex-shrink: 0;
  position: relative;
  height: ${HEADER_HEIGHT_PX}px;
  border-bottom: 1px solid ${(p) => getTheme(p).palette.divider};
  background-color: ${(p) => alpha(getTheme(p).palette.text.primary, 0.04)};
`

const Scroller = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
`

const TickLabel = styled(Typography, {
  shouldForwardProp: getShouldForwardProp,
})<{
  leftPx: number
}>`
  position: absolute;
  top: 0;
  left: ${(p) => p.leftPx}px;
  line-height: ${HEADER_HEIGHT_PX}px;
  white-space: nowrap;
  pointer-events: none;
  ${mediaQueryForMobiles} {
    font-size: 60%;
  }
`

const RowsArea = styled.div`
  position: relative;
  min-height: 100%;
  box-sizing: border-box;
  /* keeps the last row clear of the floating controls */
  padding-bottom: 56px;
`

const GridLine = styled.div<{ leftPx: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(p) => p.leftPx}px;
  width: 1px;
  background-color: ${(p) => getTheme(p).palette.divider};
  pointer-events: none;
`

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  height: 64px;
`

const EventRow = styled.div`
  position: relative;
  height: ${EVENT_HEIGHT_PX + ROW_PAD_PX}px;
`

const EventButton = styled(ButtonBase, {
  shouldForwardProp: getShouldForwardProp,
})<
  PositionProps & {
    isFaved: boolean
    isFilteredIn: boolean
    isClippedLeft: boolean
    isClippedRight: boolean
  }
>`
  position: absolute;
  top: ${ROW_PAD_PX}px;
  left: ${(p) => p.leftPx}px;
  width: ${(p) => p.widthPx}px;
  height: ${EVENT_HEIGHT_PX}px;
  padding-left: 8px;
  padding-right: 8px;
  justify-content: flex-start;
  align-items: normal;
  overflow: hidden;
  cursor: pointer;
  // background-color: ${(p) =>
    alpha(getTheme(p).palette.primary.main, p.isFilteredIn ? 0.75 : 0.25)};
  background-color: rgba(255, 255, 255, 0.1);
  color: ${(p) =>
    p.isFaved
      ? getTheme(p).palette.primary.contrastText
      : getTheme(p).palette.text.primary};
  /* outline (not border) so the faved marker doesn't shift the absolutely
     positioned performances inside */
  border: none;
  outline: ${(p) =>
    p.isFaved ? `2px solid ${getTheme(p).palette.primary.main}` : 'none'};
  outline-offset: -2px;
  border-radius: 5px;
  border-top-left-radius: ${(p) => (p.isClippedLeft ? 0 : 'inherit')};
  border-bottom-left-radius: ${(p) => (p.isClippedLeft ? 0 : 'inherit')};
  border-top-right-radius: ${(p) => (p.isClippedRight ? 0 : 'inherit')};
  border-bottom-right-radius: ${(p) => (p.isClippedRight ? 0 : 'inherit')};

  && {
    border-radius: ${(p) => getTheme(p).shape.borderRadius}px;
  }

  &.Mui-focusVisible {
    outline: 2px solid ${(p) => getTheme(p).palette.primary.light};
    outline-offset: 2px;
  }
`

const EventLabel = styled.div`
  width: 100%;
  display: flex;
  align-items: first baseline;
  & > *:first-child {
    margin-right: 0.5rem;
  }
`

const EventName = styled(Typography)`
  flex-shrink: 0;
  font-size: 90%;
  font-weight: 600;
  margin-top: 4px;
`

const Performances = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`

const PerformanceBox = styled.div<PositionProps>`
  position: absolute;
  top: 21px;
  left: ${(p) => p.leftPx}px;
  width: ${(p) => p.widthPx}px;
  height: ${PERFORMANCE_HEIGHT_PX}px;
  overflow: hidden;
  border-radius: 4px;
  padding: 0 0 0 5px;
  // background-color: ${(p) => getTheme(p).palette.primary.dark};
  background-color: rgba(255, 255, 255, 0.1);
  // color: ${(p) => getTheme(p).palette.text.primary};
  color: rgb(175, 175, 175);
  text-align: left;
`

const NowLine = styled.div<{ leftPx: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(p) => p.leftPx}px;
  width: ${NOW_LINE_WIDTH_PX}px;
  background-color: ${(p) => getTheme(p).palette.error.main};
  z-index: 3;
  pointer-events: none;
`

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0.1rem;
  > * {
    margin: 0.1rem !important;
  }
`

const Genres = styled.div`
  position: relative;
  top: -1px;
  font-size: 75%;
  span {
    margin-right: 0.25rem;
    color: rgb(150, 150, 150);
  }
`

interface ParsedPerformance {
  performance: Performance
  startMs: number
  endMs: number
  lane: number
}

interface ParsedEvent {
  event: EventForList
  startMs: number
  endMs: number
  performances: ParsedPerformance[]
  laneCount: number
  rowIdx: number
}

interface ProjectedBoxPx {
  leftPx: number
  widthPx: number
  isClippedLeft: boolean
  isClippedRight: boolean
}

/** Greedy lane packing so overlapping sub-events stack instead of overlap. */
function getPackedLanes<T extends { startMs: number; endMs: number }>(
  items: T[]
) {
  const order = items
    .map((_, i) => i)
    .sort((a, b) => items[a].startMs - items[b].startMs)
  const laneEndsMs: number[] = []
  const lanes: number[] = new Array(items.length).fill(0)

  for (const idx of order) {
    const { startMs, endMs } = items[idx]
    let lane = laneEndsMs.findIndex(
      (laneEndMs) => laneEndMs + EVENT_GAP_MS <= startMs
    )
    if (lane === -1) {
      lane = laneEndsMs.length
      laneEndsMs.push(endMs)
    } else {
      laneEndsMs[lane] = endMs
    }
    lanes[idx] = lane
  }
  return { lanes, laneCount: laneEndsMs.length }
}

function getParsedEvents(events: EventForList[]): ParsedEvent[] {
  const parsedEvents: ParsedEvent[] = []

  for (const event of events) {
    const startMs = Date.parse(event.startsat)
    const endMs = Date.parse(event.endsat)
    if (Number.isNaN(startMs) || Number.isNaN(endMs)) continue

    const rawPerformances = (event.performances ?? [])
      .map((performance) => ({
        performance,
        startMs: Date.parse(performance.startsat),
        endMs: Date.parse(performance.endsat),
      }))
      .filter((p) => !Number.isNaN(p.startMs) && !Number.isNaN(p.endMs))

    const { lanes, laneCount } = getPackedLanes(rawPerformances)

    parsedEvents.push({
      event,
      startMs,
      endMs,
      laneCount,
      performances: rawPerformances.map((p, i) => ({ ...p, lane: lanes[i] })),
      rowIdx: -1,
    })
  }

  const sorted = parsedEvents.sort(
    (a, b) => a.startMs - b.startMs || a.endMs - b.endMs
  )
  const { lanes } = getPackedLanes(sorted)
  return sorted.map((e, i) => ({ ...e, rowIdx: lanes[i] }))

  // return parsedEvents.sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs)
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
})
const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

function getDaySpans(viewStartMs: number, viewEndMs: number) {
  const spans: { startMs: number; endMs: number }[] = []
  const cursor = new Date(viewStartMs)
  cursor.setHours(0, 0, 0, 0)

  while (cursor.getTime() < viewEndMs) {
    const startMs = cursor.getTime()
    cursor.setDate(cursor.getDate() + 1) // handles DST (23/25h days)
    spans.push({ startMs, endMs: cursor.getTime() })
  }
  return spans
}

function appendToRows(
  items: ParsedEvent[], // sorted by start time
  rowOf: Map<string, number>
): ParsedEvent[][] {
  // forget events that left this group (gone from the data, or favorited/unfavorited)
  const present = new Set(items.map(({ event }) => event.id))
  for (const id of rowOf.keys()) {
    if (!present.has(id)) rowOf.delete(id)
  }

  const rows: ParsedEvent[][] = []
  const pending: ParsedEvent[] = []

  for (const item of items) {
    const rowIndex = rowOf.get(item.event.id)
    if (rowIndex === undefined) pending.push(item)
    else (rows[rowIndex] ??= []).push(item)
  }

  for (const item of pending) {
    let rowIndex = 0
    while (
      rows[rowIndex]?.some(
        (other) => other.startMs < item.endMs && item.startMs < other.endMs
      )
    ) {
      rowIndex++
    }
    ;(rows[rowIndex] ??= []).push(item)
    rowOf.set(item.event.id, rowIndex)
  }

  // rows can be sparse if everything in them left, so fill the holes
  return Array.from(rows, (row) => row ?? [])
}

const HorizontalTimeline = ({
  fill,
  initialDate,
  events,
  onEventClick,
  onPerformanceClick,
  onRangeChange,
  halfWindowMs = TWO_HOUR_MS, // how much to see before and after "now"
  isLoading,
  hydrate,
}: HorizontalTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [containerWidthPx, setContainerWidthPx] = useState(0)
  const [nowMs, setNowMs] = useState<number>(
    () => initialDate?.getTime() || Date.now()
  )
  const [panningAnchorMs, setPanningAnchorMs] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [filters] = useEventFilters()

  const dragRef = useRef<{
    startXPx: number
    startYPx: number
    startCenterMs: number
    startScrollTop: number
    pointerId: number
    isActive: boolean
    hasMovedX: boolean
    lastCenterMs: number
  } | null>(null)

  const scrollerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const elem = containerRef.current
    if (!elem) return
    const onResize = () => setContainerWidthPx(elem.clientWidth)
    onResize()
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(elem)
    return () => resizeObserver.disconnect()
  }, [])

  const centerMs = panningAnchorMs ?? nowMs
  const viewStartMs = centerMs - halfWindowMs
  const viewEndMs = centerMs + halfWindowMs
  const pxPerMsRatio =
    containerWidthPx > 0 ? containerWidthPx / (2 * halfWindowMs) : 0
  const getTimestampPx = (timestampMs: number) =>
    (timestampMs - viewStartMs) * pxPerMsRatio

  const favedEventIds = useEventsFavoriting()

  const parsedEvents = useMemo(
    () => getParsedEvents(events),
    [events.map((ev) => ev.id).join(',')]
  )

  const rowOfRef = useRef({
    faved: new Map<string, number>(),
    other: new Map<string, number>(),
  })

  const eventRows = useMemo(() => {
    const faved = new Set(favedEventIds)
    const favedEvents = parsedEvents.filter(({ event }) => faved.has(event.id))
    const otherEvents = parsedEvents.filter(({ event }) => !faved.has(event.id))
    return [
      ...appendToRows(favedEvents, rowOfRef.current.faved),
      ...appendToRows(otherEvents, rowOfRef.current.other),
    ]
  }, [parsedEvents.map((ev) => ev.event.id).join(','), favedEventIds.join(',')])

  const daySpans = useMemo(
    () => getDaySpans(viewStartMs, viewEndMs),
    [viewStartMs, viewEndMs]
  )

  // clamp a time span to the viewport
  // returns null when fully off-screen
  const getProjectedBoxPx = (
    startMs: number,
    endMs: number
  ): ProjectedBoxPx | null => {
    const unclippedLeftPx = getTimestampPx(startMs)
    const unclippedRightPx = getTimestampPx(endMs)
    const leftPx = Math.max(unclippedLeftPx, 0)
    const rightPx = Math.min(unclippedRightPx, containerWidthPx)
    if (rightPx <= leftPx) return null
    return {
      leftPx,
      widthPx: Math.max(rightPx - leftPx, 2),
      isClippedLeft: unclippedLeftPx < 0,
      isClippedRight: unclippedRightPx > containerWidthPx,
    }
  }

  // two-finger trackpad swipe / shift+wheel to pan
  // latest values live in refs so the native listener is attached only once
  const centerMsRef = useRef(centerMs)
  centerMsRef.current = centerMs
  const latestRef = useRef({ pxPerMsRatio, halfWindowMs })
  latestRef.current = { pxPerMsRatio, halfWindowMs }
  const wheelTimeoutRef = useRef<number>()

  useEffect(() => {
    const elem = containerRef.current
    if (!elem) return

    const onWheel = (e: WheelEvent) => {
      const { pxPerMsRatio: ratio } = latestRef.current
      if (ratio === 0) return

      const isShiftScroll = e.shiftKey && e.deltaX === 0 // regular mouse wheel
      let deltaPx = isShiftScroll ? e.deltaY : e.deltaX
      const isHorizontal =
        isShiftScroll || Math.abs(e.deltaX) > Math.abs(e.deltaY)
      if (!isHorizontal || deltaPx === 0) return // leave vertical scrolling to the page

      if (e.deltaMode === 1) deltaPx *= WHEEL_LINE_HEIGHT_PX // lines -> px (Firefox)
      e.preventDefault()

      const nextCenterMs = centerMsRef.current + deltaPx / ratio
      centerMsRef.current = nextCenterMs // keep in sync between renders
      setPanningAnchorMs(nextCenterMs)

      // trackpads emit a stream of events with momentum - report once it settles
      window.clearTimeout(wheelTimeoutRef.current)
      wheelTimeoutRef.current = window.setTimeout(() => {
        const { halfWindowMs: latestHalfWindowMs } = latestRef.current
        onRangeChange?.({
          start: new Date(centerMsRef.current - latestHalfWindowMs),
          end: new Date(centerMsRef.current + latestHalfWindowMs),
        })
      }, WHEEL_SETTLE_DELAY_MS)
    }

    elem.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      elem.removeEventListener('wheel', onWheel)
      window.clearTimeout(wheelTimeoutRef.current)
    }
  }, [])

  const ticks = useMemo(() => {
    if (pxPerMsRatio === 0) return []
    const stepMs =
      TICK_STEPS_MS.find((s) => s * pxPerMsRatio >= MIN_TICK_SPACING_PX) ??
      TICK_STEPS_MS[TICK_STEPS_MS.length - 1]
    const timezoneOffsetMs =
      new Date(viewStartMs).getTimezoneOffset() * MINUTE_MS
    const firstTickMs =
      Math.ceil((viewStartMs - timezoneOffsetMs) / stepMs) * stepMs +
      timezoneOffsetMs
    const ticksToRender: { tickMs: number; label: string }[] = []
    for (let tickMs = firstTickMs; tickMs <= viewEndMs; tickMs += stepMs) {
      ticksToRender.push({
        tickMs,
        label: timeFormatter.format(tickMs),
      })
    }
    return ticksToRender
  }, [viewStartMs, viewEndMs, pxPerMsRatio])

  const onRangeEmit = (newCenterMs: number) =>
    onRangeChange?.({
      start: new Date(newCenterMs - halfWindowMs),
      end: new Date(newCenterMs + halfWindowMs),
    })

  const onDragStart = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragRef.current = {
      startXPx: e.clientX,
      startYPx: e.clientY,
      startCenterMs: centerMs,
      startScrollTop: scrollerRef.current?.scrollTop ?? 0,
      pointerId: e.pointerId,
      isActive: false,
      hasMovedX: false,
      lastCenterMs: centerMs,
    }
  }

  const onDragMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || pxPerMsRatio === 0) return
    const deltaXPx = e.clientX - drag.startXPx
    const deltaYPx = e.clientY - drag.startYPx

    if (!drag.isActive) {
      if (
        Math.abs(deltaXPx) < DRAG_THRESHOLD_PX &&
        Math.abs(deltaYPx) < DRAG_THRESHOLD_PX
      )
        return
      drag.isActive = true
      e.currentTarget.setPointerCapture(drag.pointerId)
      setIsDragging(true)
    }

    // dragging down reveals rows above, so scroll position decreases
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = drag.startScrollTop - deltaYPx
    }

    // a purely vertical drag shouldn't move the time window or fetch data
    if (Math.abs(deltaXPx) >= DRAG_THRESHOLD_PX) drag.hasMovedX = true
    if (drag.hasMovedX) {
      drag.lastCenterMs = drag.startCenterMs - deltaXPx / pxPerMsRatio
      setPanningAnchorMs(drag.lastCenterMs)
    }
  }

  const onDragEnd = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag?.isActive) return
    if (e.currentTarget.hasPointerCapture(drag.pointerId)) {
      e.currentTarget.releasePointerCapture(drag.pointerId)
    }
    setIsDragging(false)
    if (drag.hasMovedX) onRangeEmit(drag.lastCenterMs)
  }

  const onResetToNow = () => {
    setPanningAnchorMs(null)
    onRangeEmit(Date.now())
  }

  useEffect(() => {
    onResetToNow()
  }, [])

  const nowPx = getTimestampPx(nowMs)
  const isNowVisible = nowPx >= 0 && nowPx <= containerWidthPx

  return (
    <Root
      fill={fill!!}
      ref={containerRef}
      isDragging={isDragging}
      onPointerDown={onDragStart}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      onPointerCancel={onDragEnd}>
      {/* Date */}
      <DateRow>
        {daySpans.map(({ startMs, endMs }) => {
          const dayBoxPx = getProjectedBoxPx(startMs, endMs)
          if (!dayBoxPx) return null
          return (
            <DayCell
              key={startMs}
              leftPx={dayBoxPx.leftPx}
              widthPx={dayBoxPx.widthPx}
              isClippedLeft={dayBoxPx.isClippedLeft}>
              <DayLabel variant="caption">
                {dayFormatter.format(startMs)}
              </DayLabel>
            </DayCell>
          )
        })}
      </DateRow>

      {/* Axis */}
      <AxisRow>
        {ticks.map(({ tickMs, label }) => (
          <TickLabel
            key={tickMs}
            variant="caption"
            color="text.secondary"
            leftPx={getTimestampPx(tickMs) + 6}>
            {label}
          </TickLabel>
        ))}
      </AxisRow>

      {/* Rows */}
      <Scroller ref={scrollerRef}>
        <RowsArea>
          {/* Grid lines */}
          {ticks.map(({ tickMs }) => (
            <GridLine
              key={tickMs}
              leftPx={getTimestampPx(tickMs)}
              data-tick={tickMs}
            />
          ))}

          {parsedEvents.length === 0 && (
            <EmptyState>
              <Typography variant="body2" color="text.secondary">
                No events to show
              </Typography>
            </EmptyState>
          )}

          {eventRows.map((rowEvents, lane) => (
            <EventRow key={lane}>
              {rowEvents.map(({ event, startMs, endMs, performances }) => {
                const eventBoxPx = getProjectedBoxPx(startMs, endMs)
                const isFaved = favedEventIds.includes(event.id)
                const genresToHighlight = event.genres.filter((genre) =>
                  filters.genres.includes(genre)
                )
                const isFilteredIn =
                  event.genres.some((genre) =>
                    filters.genres.includes(genre)
                  ) || event.tags.some((tag) => filters.tags.includes(tag))

                if (!eventBoxPx) return null

                return (
                  // <Tooltip
                  //   disableInteractive
                  //   title={
                  //     <>
                  //       <strong>{event.name}</strong>
                  //       <br />
                  //       {getRangeStr(startMs, endMs)}
                  //     </>
                  //   }>
                  <EventButton
                    disableRipple
                    onClick={() => onEventClick?.(event)}
                    leftPx={eventBoxPx.leftPx}
                    widthPx={eventBoxPx.widthPx}
                    isFaved={isFaved}
                    isFilteredIn={isFilteredIn}
                    isClippedLeft={eventBoxPx.isClippedLeft}
                    isClippedRight={eventBoxPx.isClippedRight}>
                    <EventLabel>
                      <EventName variant="body2" noWrap>
                        {event.name}
                      </EventName>
                      {event.genres.length ? (
                        <Genres>
                          {event.genres.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </Genres>
                      ) : null}
                    </EventLabel>
                    <Performances>
                      {performances.map(
                        (
                          {
                            performance,
                            startMs: performanceStartMs,
                            endMs: performanceEndMs,
                          },
                          idx
                        ) => {
                          const performanceBoxPx = getProjectedBoxPx(
                            performanceStartMs,
                            performanceEndMs
                          )
                          if (!performanceBoxPx) return null

                          const fullPerformance = event.fullperformances[idx]

                          const label = fullPerformance
                            ? fullPerformance.fullperformername ||
                              fullPerformance.performername
                            : performance.performerid?.substring(0, 10) ||
                              performance.performername

                          return (
                            // <Tooltip
                            //   key={`${performance.performerid}-${performanceStartMs}`}
                            //   disableInteractive
                            //   title={
                            //     <>
                            //       <strong>{label}</strong>
                            //       <br />
                            //       {getRangeStr(
                            //         performanceStartMs,
                            //         performanceEndMs
                            //       )}
                            //     </>
                            //   }>
                            <PerformanceBox
                              leftPx={
                                performanceBoxPx.leftPx - eventBoxPx.leftPx + 2
                              }
                              widthPx={performanceBoxPx.widthPx - 1}
                              data-performer={performance.performerid}>
                              <Typography variant="caption" noWrap>
                                {label}
                              </Typography>
                            </PerformanceBox>
                            // </Tooltip>
                          )
                        }
                      )}
                    </Performances>
                  </EventButton>
                  // </Tooltip>
                  //   )}
                  // </EventRow>
                )
              })}{' '}
            </EventRow>
          ))}
        </RowsArea>
      </Scroller>

      {/* Current time */}
      {isNowVisible && (
        <NowLine
          aria-label="Current time"
          leftPx={nowPx - NOW_LINE_WIDTH_PX / 2}
        />
      )}

      <Controls>
        <Suspense>
          <FilterButton />
          {hydrate && (
            <Button
              size="large"
              color="secondary"
              onClick={hydrate}
              icon={<RefreshIcon />}
              title="Refresh"
            />
          )}
          {panningAnchorMs !== null && (
            <Button
              size="large"
              onClick={onResetToNow}
              color="secondary"
              icon={<HistoryIcon />}
              title="Reset to now"
            />
          )}
        </Suspense>
      </Controls>
    </Root>
  )
}

export default HorizontalTimeline
