// import styled from '@emotion/styled'
// import Table from '@/components/responsive-table'
// import TableBody from '@mui/material/TableBody'
// import { TableCell } from '@/components/responsive-table'
// import { TableRow } from '@/components/responsive-table'

// import { ViewNames } from 'shared/modules/analytics'
// import PaginatedView from '@/components/paginated-view'
// import Heading from '@/components/heading'

// const Columns = styled.div`
//   display: flex;
// `
// const Column = styled.div`
//   padding: 0.5rem;
//   &:first-child {
//     min-width: 100px;
//   }
// `
// const Title = styled.span``

// type AnalyticsEntryForAsset = any

// const Renderer = ({ items }: { items?: AnalyticsEntryForAsset[] }) => {
//   return (
//     <>
//       {items?.map((entry, idx) => (
//         <Columns key={entry.asset.id}>
//           <Column>
//             <Title style={{ fontSize: `${100 + 50 * (items.length - idx)}%` }}>
//               #{idx + 1}
//             </Title>
//           </Column>
//           <Column>
//             <Table>
//               <TableBody>
//                 {Object.entries(entry.url_counts).map(([url, total]) => (
//                   <TableRow key={url}>
//                     <TableCell>{url}</TableCell>
//                     {/* <TableCell>{total}</TableCell> */}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Column>
//         </Columns>
//       ))}
//     </>
//   )
// }

// const Analytics = () => (
//   <>
//     <Heading variant="h1">Analytics</Heading>
//     <PaginatedView<AnalyticsEntryForAsset>
//       viewName={ViewNames.GetTopAssetAnalytics}>
//       <Renderer />
//     </PaginatedView>
//   </>
// )

// export default Analytics
