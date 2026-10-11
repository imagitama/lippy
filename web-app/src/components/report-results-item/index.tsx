import React, { Fragment } from 'react'
import Link from '@/components/link'
import { TableCell } from '@/components/responsive-table'
import { TableRow } from '@/components/responsive-table'

import * as routes from '@/routes'
import {
  FullReport,
  getLabelForReason,
  reportReasonsKeysByCollection,
} from 'shared/modules/reports'

import WarningMessage from '@/components/warning-message'
import FormattedDate from '@/components/formatted-date'
// import GenericOutputItem from '@/components/generic-output-item'
import ResolutionStatus from '@/components/resolution-status'
import ShortId from '../short-id'

export default ({
  report,
  showParentDetails = true,
  analyticsCategoryName = '',
}: {
  report: FullReport
  showParentDetails?: boolean
  showControls?: boolean
  analyticsCategoryName?: string
}) => {
  const {
    id: reportId,
    parenttable,
    reason,
    createdat,
    createdby,

    // meta
    resolutionstatus: resolutionStatus,

    // view
    parentdata,
    createdbyusername: createdByUsername,
    resolvedbyusername: resolvedByUsername,
  } = report

  return (
    <Fragment key={reportId}>
      <TableRow key={reportId} title={reportId}>
        <TableCell>
          <ShortId
            url={routes.viewReportWithVar.replace(':reportId', reportId)}>
            {reportId}
          </ShortId>
          <br />
          <Link to={routes.viewReportWithVar.replace(':reportId', reportId)}>
            View Report
          </Link>
        </TableCell>
        {/* {showParentDetails && (
          <TableCell>
            <GenericOutputItem
              type={parenttable}
              id={parent}
              data={parentdata}
              small
            />
          </TableCell>
        )} */}
        <TableCell>{getLabelForReason(reason, parenttable) || '-'}</TableCell>
        <TableCell>
          <FormattedDate date={createdat} />{' '}
          {createdByUsername ? (
            <>
              by{' '}
              <Link to={routes.viewUserWithVar.replace(':userId', createdby)}>
                {createdByUsername}
              </Link>
            </>
          ) : null}
        </TableCell>
        <TableCell label="Status">
          {/* <ResolutionStatus
            resolutionStatus={resolutionStatus}
            resolvedByUsername={resolvedByUsername}
          /> */}
          Resolution status: {resolutionStatus} (by who - todo)
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
