import styled from '@emotion/styled'
import { FullPerformance, Performance } from 'shared/modules/performances'
import { CustomTheme } from '@/themes'
import moment from 'moment'
import { useMemo } from 'react'

const Root = styled.div`
  & > * {
    margin-bottom: 0.25rem;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
`
const Item = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }: { theme?: CustomTheme }) =>
    theme!.shape.borderRadius}px;
  padding: 0.25rem;
`
const Date = styled.div``
const Label = styled.div`
  font-weight: bold;
`

function getFriendlyDate(date: string): string {
  return moment(date).format('HH:mm')
}

const getPerformanceLabel = (perf: Performance | FullPerformance) =>
  'fullperformername' in perf && perf.fullperformername
    ? perf.fullperformername
    : perf.name || perf.performerid

export const PerformanceListItem = ({
  performances,
}: {
  performances: (Performance | FullPerformance)[]
}) => {
  const { startsat, endsat } = performances[0]

  return (
    <Item>
      <Date>{getFriendlyDate(startsat)}</Date>
      <Label>
        {performances.map(getPerformanceLabel).filter(Boolean).join(', ')}
      </Label>
      <Date>{getFriendlyDate(endsat)}</Date>
    </Item>
  )
}

const PerformanceList = ({
  performances,
}: {
  performances: FullPerformance[]
}) => {
  const groups = useMemo(() => {
    const map = new Map<string, FullPerformance[]>()

    for (const perf of performances) {
      const key = `${perf.startsat}-${perf.endsat}`
      const existing = map.get(key)
      if (existing) existing.push(perf)
      else map.set(key, [perf])
    }

    return Array.from(map.entries())
  }, [performances])

  return (
    <Root>
      {groups.map(([key, group]) => (
        <PerformanceListItem key={key} performances={group} />
      ))}
    </Root>
  )
}

export default PerformanceList
