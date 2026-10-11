import React, { Suspense } from 'react'
import EditIcon from '@mui/icons-material/Edit'

import Table from '@/components/responsive-table'
import TableBody from '@mui/material/TableBody'
import { TableCell } from '@/components/responsive-table'
import { TableHead } from '@/components/responsive-table'
import { TableRow } from '@/components/responsive-table'

import {
  AdminQueueItem,
  AdminQueueItemType,
  ViewNames,
} from 'shared/modules/admin-queue'
import * as routes from '@/routes'
import { capitalize } from '@/utils'

import useDataStoreItem from '@/hooks/useDataStoreItem'
import useDataStoreItems from '@/hooks/useDataStoreItems'

import Markdown from '@/components/markdown'
import LoadingIndicator from '@/components/loading-indicator'
import ErrorMessage from '@/components/error-message'
import Button from '@/components/button'
import Heading from '@/components/heading'
import Link from '@/components/link'
import FormattedDate from '@/components/formatted-date'
import UsernameLink from '@/components/username-link'
import GenericOutputLabel from '@/components/generic-output-label'
import ErrorBoundary from '@/components/error-boundary'
import Paper from '@/components/paper'
import NoResultsMessage from '@/components/no-results-message'
import ShortId from '@/components/short-id'
import HydrateVrchatInstancesButton from './components/hydrate-vrchat-instance-button'

const parentName = 'admin'
const pageName = 'notepad'

export default () => {
  return (
    <>
      <Heading variant="h1">Admin</Heading>
      <Heading variant="h2">Controls</Heading>
      <HydrateVrchatInstancesButton />
    </>
  )
}
