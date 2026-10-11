import styled from '@emotion/styled'
import { FullPerformance } from 'shared/modules/events'
import FormattedDate from '../formatted-date'

const Root = styled.div``
const Item = styled.div``
const Date = styled.div``
const Label = styled.div``

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
            <FormattedDate date={perf.startsat} />
          </Date>
          <Label>
            {perf.performerid ? perf.fullperformername : perf.performername}
          </Label>
          <Date>
            <FormattedDate date={perf.endsat} />
          </Date>
        </Item>
      ))}
    </Root>
  )
}

export default PerformanceList
