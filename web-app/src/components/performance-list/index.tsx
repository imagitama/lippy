import styled from '@emotion/styled'
import { FullPerformance } from 'shared/modules/events'
import FormattedDate from '../formatted-date'
import { CustomTheme } from '@/themes'

const Root = styled.div`
  & > * {
    margin-botton: 0.25rem;
  }
  & > *:last-child {
    margin-botton: 0;
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

const PerformanceList = ({
  performances,
}: {
  performances: FullPerformance[]
}) => {
  return (
    <Root>
      {performances.map((perf) => (
        <Item>
          <Date>
            <FormattedDate date={perf.startsat} isRelative={false} /> (
            <FormattedDate date={perf.startsat} isRelative />)
          </Date>
          <Label>
            {perf.performerid ? perf.fullperformername : perf.performername}
          </Label>
          <Date>
            <FormattedDate date={perf.endsat} isRelative={false} /> (
            <FormattedDate date={perf.endsat} isRelative />)
          </Date>
        </Item>
      ))}
    </Root>
  )
}

export default PerformanceList
