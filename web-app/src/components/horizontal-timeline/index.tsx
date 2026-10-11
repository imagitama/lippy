import React, {
  PointerEvent,
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { darken } from '@mui/material/styles'
import { alpha, useTheme } from '@mui/material/styles'
import HistoryIcon from '@mui/icons-material/History'

import { Event, EventForList, Performance } from 'shared/modules/events'
import { Performer } from 'shared/modules/performers'

import { useEventsFavoriting } from '@/hooks/useEventFavoriting'
import useEventFilters from '@/hooks/useEventFilters'

import TagList from '../tag-list'
import FilterButton from './components/filter-button'
import Button from '../button'
import { Refresh as RefreshIcon } from '@/icons'

export interface TimeRange {
  start: Date
  end: Date
}

const PerformanceBox = styled.div`
  border-radius: 4px;
  padding: 0 0 0 5px;
`
const EventLabel = styled.div`
  height: 30px;
  display: flex;
  align-items: first baseline;
  & > *:first-child {
    margin-right: 0.5rem;
  }
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

export interface HorizontalTimelineProps {
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
/** Wait this long after the last wheel event before reporting the new range. */
const WHEEL_SETTLE_DELAY_MS = 200

const DATE_ROW_HEIGHT_PX = 24
const HEADER_HEIGHT_PX = 32
const ROW_PAD_PX = 8
const EVENT_HEIGHT_PX = 50
const PERFORMANCE_HEIGHT_PX = 22
const NOW_LINE_WIDTH_PX = 3
const DRAG_THRESHOLD_PX = 4
const MIN_TICK_SPACING_PX = 45
const WHEEL_LINE_HEIGHT_PX = 16 // Firefox reports wheel deltas in lines

const TICK_STEPS_MS = [
  30 * MINUTE_MS,
  HOUR_MS,
  2 * HOUR_MS,
  3 * HOUR_MS,
  6 * HOUR_MS,
  12 * HOUR_MS,
  24 * HOUR_MS,
]

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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
    let lane = laneEndsMs.findIndex((laneEndMs) => laneEndMs <= startMs)
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
    })
  }

  return parsedEvents.sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs)
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
})
const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

function getRangeStr(startMs: number, endMs: number) {
  return `${dateTimeFormatter.format(startMs)} – ${dateTimeFormatter.format(
    endMs
  )}`
}

/** Local calendar-day spans that overlap [viewStartMs, viewEndMs]. */
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

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const HorizontalTimeline = ({
  events,
  onEventClick,
  onPerformanceClick,
  onRangeChange,
  halfWindowMs = TWO_HOUR_MS, // how much to see before and after "now"
  isLoading,
  hydrate,
}: HorizontalTimelineProps) => {
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const [containerWidthPx, setContainerWidthPx] = useState(0)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [panningAnchorMs, setPanningAnchorMs] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [filters] = useEventFilters()

  const dragRef = useRef<{
    startXPx: number
    startCenterMs: number
    pointerId: number
    isActive: boolean
    lastCenterMs: number
  } | null>(null)

  useLayoutEffect(() => {
    const elem = containerRef.current
    if (!elem) return
    const onResize = () => setContainerWidthPx(elem.clientWidth)
    onResize()
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(elem)
    return () => resizeObserver.disconnect()
  }, [])

  //   useEffect(() => {
  //     const id = window.setInterval(() => setNowMs(Date.now()), 1000)
  //     return () => window.clearInterval(id)
  //   }, [])

  const centerMs = panningAnchorMs ?? nowMs
  const viewStartMs = centerMs - halfWindowMs
  const viewEndMs = centerMs + halfWindowMs
  const pxPerMsRatio =
    containerWidthPx > 0 ? containerWidthPx / (2 * halfWindowMs) : 0
  const getTimestampPx = (timestampMs: number) =>
    (timestampMs - viewStartMs) * pxPerMsRatio

  const parsedEvents = useMemo(() => getParsedEvents(events), [events])

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
  const latestRef = useRef({ pxPerMsRatio, halfWindowMs, onRangeChange })
  latestRef.current = { pxPerMsRatio, halfWindowMs, onRangeChange }
  const wheelTimeoutRef = useRef<number>()

  const favedEventIds = useEventsFavoriting()

  React.useEffect(() => {
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
        const { halfWindowMs: latestHalfWindowMs, onRangeChange: onChange } =
          latestRef.current
        onChange?.({
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
      const date = new Date(tickMs)
      // const isMidnight = date.getHours() === 0 && date.getMinutes() === 0
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
      startCenterMs: centerMs,
      pointerId: e.pointerId,
      isActive: false,
      lastCenterMs: centerMs,
    }
  }

  const onDragMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || pxPerMsRatio === 0) return
    const deltaXPx = e.clientX - drag.startXPx

    if (!drag.isActive) {
      if (Math.abs(deltaXPx) < DRAG_THRESHOLD_PX) return
      drag.isActive = true
      // capture only once it's a real drag so plain clicks still reach the bars
      e.currentTarget.setPointerCapture(drag.pointerId)
      setIsDragging(true)
    }

    // dragging right reveals the past, so the centre time moves earlier
    drag.lastCenterMs = drag.startCenterMs - deltaXPx / pxPerMsRatio
    setPanningAnchorMs(drag.lastCenterMs)
  }

  const onDragEnd = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag?.isActive) return
    if (e.currentTarget.hasPointerCapture(drag.pointerId)) {
      e.currentTarget.releasePointerCapture(drag.pointerId)
    }
    setIsDragging(false)
    onRangeEmit(drag.lastCenterMs)
  }

  const onResetToNow = () => {
    setPanningAnchorMs(null)
    onRangeEmit(Date.now())
  }

  const nowPx = getTimestampPx(nowMs)
  const isNowVisible = nowPx >= 0 && nowPx <= containerWidthPx
  const gridColor = theme.palette.divider

  return (
    <Box
      ref={containerRef}
      onPointerDown={onDragStart}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      onPointerCancel={onDragEnd}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'pan-y',
      }}>
      {/* Date */}
      <Box
        sx={{
          position: 'relative',
          height: DATE_ROW_HEIGHT_PX,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.text.primary, 0.08),
          overflow: 'hidden',
        }}>
        {daySpans.map(({ startMs, endMs }) => {
          const dayBoxPx = getProjectedBoxPx(startMs, endMs)
          if (!dayBoxPx) return null
          return (
            <Box
              key={startMs}
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: dayBoxPx.leftPx,
                width: dayBoxPx.widthPx,
                overflow: 'hidden',
                // divider only where the day actually starts on screen
                borderLeft: dayBoxPx.isClippedLeft ? 'none' : 1,
                borderColor: 'divider',
                pointerEvents: 'none',
              }}>
              <Typography
                variant="caption"
                // fontWeight={600}
                sx={{
                  pl: 0.75,
                  lineHeight: `${DATE_ROW_HEIGHT_PX}px`,
                  whiteSpace: 'nowrap',
                }}>
                {dayFormatter.format(startMs)}
              </Typography>
            </Box>
          )
        })}
      </Box>
      {/* Axis */}
      <Box
        sx={{
          position: 'relative',
          height: HEADER_HEIGHT_PX,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.text.primary, 0.04),
        }}>
        {ticks.map(({ tickMs, label }) => (
          <Typography
            key={tickMs}
            variant="caption"
            color="text.secondary"
            sx={{
              position: 'absolute',
              left: getTimestampPx(tickMs) + 6,
              top: 0,
              lineHeight: `${HEADER_HEIGHT_PX}px`,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>
            {label}
          </Typography>
        ))}
      </Box>

      {/* Rows */}
      <Box sx={{ position: 'relative', height: '100%' }}>
        {/* Grid lines */}
        {ticks.map(({ tickMs }) => (
          <Box
            key={tickMs}
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: getTimestampPx(tickMs),
              width: '1px',
              bgcolor: gridColor,
              pointerEvents: 'none',
            }}
            data-tick={tickMs}
          />
        ))}

        {parsedEvents.length === 0 && (
          <Box sx={{ height: 64, display: 'grid', placeItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No events to show
            </Typography>
          </Box>
        )}

        {parsedEvents.map(({ event, startMs, endMs, performances }) => {
          const eventBoxPx = getProjectedBoxPx(startMs, endMs)
          const isFaved = favedEventIds.includes(event.id)
          const genresToHighlight = event.genres.filter((genre) =>
            filters.genres.includes(genre)
          )
          const isFilteredIn =
            event.genres.some((genre) => filters.genres.includes(genre)) ||
            event.tags.some((tag) => filters.tags.includes(tag))

          return (
            <Box
              key={event.id}
              sx={{
                position: 'relative',
                height: EVENT_HEIGHT_PX + ROW_PAD_PX,
              }}
              data-event={event.id}>
              {eventBoxPx && (
                <Tooltip
                  disableInteractive
                  title={
                    <>
                      <strong>{event.name}</strong>
                      <br />
                      {getRangeStr(startMs, endMs)}
                    </>
                  }>
                  <ButtonBase
                    disableRipple
                    onClick={() => onEventClick?.(event)}
                    sx={{
                      position: 'absolute',
                      top: ROW_PAD_PX,
                      left: eventBoxPx.leftPx,
                      width: eventBoxPx.widthPx,
                      height: EVENT_HEIGHT_PX,
                      px: 1,
                      justifyContent: 'flex-start',
                      alignItems: 'normal',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      bgcolor: !isFilteredIn
                        ? alpha(theme.palette.primary.main, 0.25)
                        : alpha(theme.palette.primary.main, 0.75),
                      color: !isFaved
                        ? theme.palette.text.primary
                        : theme.palette.primary.contrastText,
                      border: isFaved
                        ? `2px dashed ${theme.palette.tertiary.main}`
                        : 'none',
                      borderRadius: 1,
                      borderTopLeftRadius: eventBoxPx.isClippedLeft
                        ? 0
                        : undefined,
                      borderBottomLeftRadius: eventBoxPx.isClippedLeft
                        ? 0
                        : undefined,
                      borderTopRightRadius: eventBoxPx.isClippedRight
                        ? 0
                        : undefined,
                      borderBottomRightRadius: eventBoxPx.isClippedRight
                        ? 0
                        : undefined,
                      '&:hover': {
                        bgcolor: !isFaved
                          ? alpha(theme.palette.primary.main, 0.9)
                          : darken(theme.palette.primary.main, 0.2),
                      },
                      '&.Mui-focusVisible': {
                        outline: `2px solid ${theme.palette.primary.light}`,
                        outlineOffset: 2,
                      },
                    }}>
                    <EventLabel>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ fontWeight: 600, marginTop: '4px' }}>
                        {event.name}
                      </Typography>
                      <TagList
                        tags={event.genres}
                        highlightTags={genresToHighlight}
                      />
                    </EventLabel>
                  </ButtonBase>
                </Tooltip>
              )}
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
                    <Tooltip
                      key={`${performance.performerid}-${performanceStartMs}`}
                      disableInteractive
                      title={
                        <>
                          <strong>{label}</strong>
                          <br />
                          {getRangeStr(performanceStartMs, performanceEndMs)}
                        </>
                      }>
                      <PerformanceBox
                        onClick={() => onEventClick?.(event)}
                        // onClick={() => onPerformanceClick?.(performer, event)}
                        style={{
                          position: 'absolute',
                          top: 35,
                          left: performanceBoxPx.leftPx + 1,
                          width: performanceBoxPx.widthPx - 2,
                          height: PERFORMANCE_HEIGHT_PX,
                          justifyContent: 'flex-start',
                          overflow: 'hidden',
                          backgroundColor: theme.palette.primary.dark,
                          color: theme.palette.text.primary,
                        }}
                        data-performer={performance.performerid}>
                        <Typography variant="caption" noWrap>
                          {label}
                        </Typography>
                      </PerformanceBox>
                    </Tooltip>
                  )
                }
              )}
            </Box>
          )
        })}
      </Box>

      {/* Current time */}
      {isNowVisible && (
        <Box
          aria-label="Current time"
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: nowPx - NOW_LINE_WIDTH_PX / 2,
            width: NOW_LINE_WIDTH_PX,
            bgcolor: 'error.main',
            zIndex: 3,
            pointerEvents: 'none',
          }}
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
    </Box>
  )
}

export default HorizontalTimeline
