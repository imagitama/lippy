import CheckIcon from '@mui/icons-material/Check'
import styled from '@emotion/styled'

import BodyText from '@/components/body-text'
import Button from '@/components/button'
import Column from '@/components/column'
import Columns from '@/components/columns'
import DialogButton from '@/components/dialog-button'
import ErrorMessage from '@/components/error-message'
import FormControls from '@/components/form-controls'
import FormattedDate from '@/components/formatted-date'
import Heading from '@/components/heading'
import LoadingIndicator from '@/components/loading-indicator'
import NoResultsMessage from '@/components/no-results-message'
import NoValueLabel from '@/components/no-value-label'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/responsive-table'
import ShortId from '@/components/short-id'
import WarningMessage from '@/components/warning-message'
import useDataStoreItems from '@/hooks/useDataStoreItems'
import useIsModerator from '@/hooks/useIsModerator'
import useSupabaseFunction from '@/hooks/useSupabaseFunction'
import { routes } from '@/routes'
import {
  CollectionNames,
  EventAlphaOrBeta,
  FullEventAlphaOrBeta,
  GetWorldDataRecord,
  ViewNames,
  WorldDataEvent,
} from 'shared/modules/world'
import { Fragment, useState } from 'react'

// const Events = () => {
//   const [isLoading, lastErrorCode, results, , hydrate] =
//     useDataStoreItems<FullEventAlphaOrBeta>(

//     )
//   const [expandedId, setExpandedId] = useState<null | string>(null)

//   if (isLoading) return <LoadingIndicator message="Loading world data..." />

//   if (lastErrorCode)
//     return (
//       <ErrorMessage errorCode={lastErrorCode}>
//         Failed to load records
//       </ErrorMessage>
//     )

//   if (!results || results.length === 0)
//     return <ErrorMessage>Data is empty/wrong</ErrorMessage>

//   return (
//     <Table size="small" noMinWidth>
//       <TableHead>
//         <TableCell></TableCell>
//         <TableCell>Atlas Info</TableCell>
//         <TableCell>Added At</TableCell>
//       </TableHead>
//       <TableBody>
//         {results.map((result) => (
//           <Fragment key={result.eventid}>
//             <TableRow>
//               <TableCell>
//                 <ShortId
//                   url={routes.viewEventWithVar.replace(
//                     ':eventId',
//                     result.eventid
//                   )}>
//                   {result.eventid}
//                 </ShortId>
//                 <Button
//                   size="small"
//                   color="secondary"
//                   onClick={() =>
//                     setExpandedId(
//                       result.eventid === expandedId ? null : result.eventid
//                     )
//                   }>
//                   Show Event
//                 </Button>
//               </TableCell>
//               <TableCell>
//                 {result.atlas ? (
//                   <>
//                     #{result.atlas.idx}
//                     <br />
//                     {result.atlas.x},{result.atlas.y}
//                   </>
//                 ) : (
//                   <NoValueLabel>(not in atlas)</NoValueLabel>
//                 )}
//               </TableCell>
//               <TableCell>
//                 <FormattedDate date={result.addedat} isRelative={false} />
//                 <br />(
//                 <FormattedDate date={result.addedat} isRelative />)
//               </TableCell>
//             </TableRow>
//             {expandedId === result.eventid && (
//               <TableRow>
//                 <TableCell colSpan={3}>
//                   {JSON.stringify(result.event)}
//                 </TableCell>
//               </TableRow>
//             )}
//           </Fragment>
//         ))}
//       </TableBody>
//     </Table>
//   )
// }

const Vrchat = () => {
  return (
    <>
      <Heading variant="h1">VRChat</Heading>
      <Heading variant="h2">Live Events With Instances</Heading>
      {/* <Events /> */}
    </>
  )
}

export default Vrchat
