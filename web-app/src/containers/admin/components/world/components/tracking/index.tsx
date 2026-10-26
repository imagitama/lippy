import ErrorMessage from '@/components/error-message'
import FormattedDate from '@/components/formatted-date'
import Heading from '@/components/heading'
import LoadingIndicator from '@/components/loading-indicator'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/responsive-table'
import ShortId from '@/components/short-id'
import useDatabaseQuery, { Operators } from '@/hooks/useDatabaseQuery'
import { routes } from '@/routes'

enum ViewNames {
  GetFullWorldGroupButtonPresses = 'getfullworldgroupbuttonpresses',
}

interface FullWorldGroupButtonPresses {
  eventid: string
  eventname: string
  count: number
  lastpressedat: string // date
}

const TrackingTable = () => {
  const [isLoading, lastErrorCode, results] =
    useDatabaseQuery<FullWorldGroupButtonPresses>(
      ViewNames.GetFullWorldGroupButtonPresses,
      []
    )

  if (isLoading) return <LoadingIndicator message="Loading..." />
  if (lastErrorCode)
    return <ErrorMessage errorCode={lastErrorCode}>Failed to load</ErrorMessage>

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell width="15%">ID</TableCell>
          <TableCell width="50%">Name</TableCell>
          <TableCell width="15%">Button Presses</TableCell>
          <TableCell width="20%">Last Pressed At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {results?.map((result) => (
          <TableRow key={result.eventid}>
            <TableCell>
              <ShortId
                url={routes.viewEventWithVar.replace(
                  ':eventId',
                  result.eventid
                )}>
                {result.eventid}
              </ShortId>
            </TableCell>
            <TableCell>{result.eventname}</TableCell>
            <TableCell>{result.count}</TableCell>
            <TableCell>
              <FormattedDate date={result.lastpressedat} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const Tracking = () => (
  <>
    <Heading variant="h2">Tracking</Heading>
    <TrackingTable />
  </>
)

export default Tracking
