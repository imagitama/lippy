import styled from '@emotion/styled'
import { FullPerformance } from 'shared/modules/events'
import { CustomTheme } from '@/themes'
import moment from 'moment'

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

const PerformanceList = ({
  performances,
}: {
  performances: FullPerformance[]
}) => {
  return (
    <Root>
      {performances.map((perf) => (
        <Item>
          <Date>{getFriendlyDate(perf.startsat)}</Date>
          <Label>
            {perf.fullperformername
              ? perf.fullperformername
              : perf.performername}
          </Label>
          <Date>{getFriendlyDate(perf.endsat)}</Date>
        </Item>
      ))}
    </Root>
  )
}

export default PerformanceList
