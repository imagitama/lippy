import {
  ExternalData,
  ExternalEvent,
  ExternalEventSlot,
} from '@/timeline/types'
import FormattedDate from '../formatted-date'
import Table, {
  TableBody,
  TableCell,
  TableRow,
} from '@/components/responsive-table'
import Columns from '@/components/columns'
import Column from '@/components/column'
import {
  EventFieldsResult,
  getEventFieldsFromExternalEvent,
} from '@/timeline/map'

const ComponentForField = ({
  name,
  val,
  all,
}: {
  name: keyof ExternalEvent
  val: any
  all: ExternalEvent
}) => {
  switch (name) {
    // case 'name': return <span>{val}</span>
    // case 'description': return <span>{val}</span>

    case 'start':
    case 'end':
      return (
        <span>
          {val}
          <br />
          Mapped:{' '}
          <FormattedDate date={new Date(val * 1000)} isRelative={false} /> (
          <FormattedDate date={new Date(val * 1000)} isRelative />)
        </span>
      )

    case 'duration':
      const secs = val
      return (
        <span>
          {secs} ({secs / 60} mins)
        </span>
      )

    case 'eventSlots':
      return (
        <Table size="small" noMinWidth>
          <TableBody>
            {(val as ExternalEventSlot[]).map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>
                  <Table size="small" noMinWidth>
                    <TableBody>
                      <TableRow>
                        <TableCell>Datetime</TableCell>
                        <TableCell>
                          {slot.start} ({slot.duration / 60} mins)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Performers</TableCell>
                        <TableCell>
                          {slot.performers.length > 0 ? (
                            <Table size="small" noMinWidth>
                              <TableBody>
                                {slot.performers.map((perf) => (
                                  <TableRow key={perf.id}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>{perf.performerId}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            '(none)'
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Flag</TableCell>
                        <TableCell>{slot.flag}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Notes</TableCell>
                        <TableCell>{slot.note || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )

    default:
      return <span>{JSON.stringify(val)}</span>
  }
}

const OurFields = ({
  ourEventFields,
}: {
  ourEventFields: EventFieldsResult
}) => {
  return (
    <Table size="small" noMinWidth>
      <TableBody>
        {Object.entries(ourEventFields).map(([fieldName, val]) => (
          <TableRow key={fieldName}>
            <TableCell>{fieldName}</TableCell>
            <TableCell>{JSON.stringify(val)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const ExternalEventOutput = ({
  importData,
  externalEvent,
}: {
  importData: ExternalData
  externalEvent: ExternalEvent
}) => {
  const ourEventFields = getEventFieldsFromExternalEvent(
    externalEvent,
    importData
  )

  return (
    <Columns>
      <Column widthPerc={50}>
        <Table size="small" noMinWidth>
          <TableBody>
            {Object.entries(externalEvent).map(([name, val]) => (
              <TableRow key={name}>
                <TableCell width="20%">{name}</TableCell>
                <TableCell width="80%">
                  <ComponentForField
                    name={name as keyof ExternalEvent}
                    val={val}
                    all={externalEvent}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Column>
      <Column widthPerc={50}>
        <OurFields ourEventFields={ourEventFields} />
      </Column>
    </Columns>
  )
}

export default ExternalEventOutput
