import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PeopleIcon from '@mui/icons-material/People'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'

import { VrchatInstance } from 'shared/modules/vrchat-cache'
import FormattedDate from '../formatted-date'
import NoValueLabel from '../no-value-label'

const getAccessLabel = (instance: VrchatInstance): string => {
  switch (instance.type) {
    case 'public':
      return 'Public'
    case 'hidden':
      return 'Friends+'
    case 'friends':
      return 'Friends'
    case 'private':
      return instance.canRequestInvite ? 'Invite+' : 'Invite'
    case 'group':
      switch (instance.groupAccessType) {
        case 'members':
          return 'Group'
        case 'plus':
          return 'Group+'
        case 'public':
          return 'Group Public'
        default:
          return 'Group'
      }
    default:
      return instance.type
  }
}

const VrchatInstanceCard = ({
  instance,
  fetchedAt,
  children,
}: {
  instance: VrchatInstance
  fetchedAt?: string
  children?: React.ReactNode
}) => {
  const { userCount, capacity, queueSize, full } = instance
  const fill = capacity > 0 ? Math.min(100, (userCount / capacity) * 100) : 0

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {instance.displayName || `Instance ${instance.name}`}
        </Typography>
        <Chip
          size="small"
          label={getAccessLabel(instance)}
          // color="primary"
          variant="outlined"
        />
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <PeopleIcon fontSize="small" />
          <Typography variant="body2">
            {userCount} / {capacity}
          </Typography>
        </Stack>

        {queueSize > 0 && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <HourglassTopIcon fontSize="small" />
            <Typography variant="body2">{queueSize} queued</Typography>
          </Stack>
        )}
      </Stack>

      <Box>
        <LinearProgress
          variant="determinate"
          value={fill}
          color={full ? 'error' : 'primary'}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>

      {children ? <Box sx={{ marginTop: '1rem' }}>{children}</Box> : null}

      {fetchedAt && (
        <Box sx={{ marginTop: '0.5rem ' }}>
          <small>
            <NoValueLabel>
              Last synced <FormattedDate date={fetchedAt} />
            </NoValueLabel>
          </small>
        </Box>
      )}
    </Paper>
  )
}

export default VrchatInstanceCard
