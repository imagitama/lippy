import React, { useState } from 'react'
import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'

import { CollectionNames, Performer } from 'shared/modules/performers'
import { Performance } from 'shared/modules/events'
import {
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  Delete as DeleteIcon,
} from '@/icons'
import { moveItemToLeft, moveItemToRight } from '@/utils'

import Button, { EditButton } from '../button'
import { CustomTheme } from '@/themes'
import FormattedDate from '../formatted-date'
import SearchableInput from '../generic-editor/components/searchable-input'
import { fieldTypes } from '@/generic-forms'
import PerformerResultsItem from '../performer-results-item'
import FormControls from '../form-controls'
import useIsDateFormatUS from '@/hooks/useIsDateFormatUS'
import TextInput from '../text-input'
import useDataStoreItem from '@/hooks/useDataStoreItem'
import LoadingIndicator from '../loading-indicator'
import ErrorMessage from '../error-message'
import NoResultsMessage from '../no-results-message'
import Link from '../link'
import { routes } from '@/routes'

const { default: moment } = await import('moment')
const LazyDateTimePicker = React.lazy(() => import('../datetime-input/lazy'))

const PerformanceDateTimeInput = ({
  value,
  onChange,
}: {
  value: string
  onChange: (newVal: string) => void
}) => {
  const [isDateFormatUS] = useIsDateFormatUS()
  return (
    <LazyDateTimePicker
      value={moment(value)}
      onChange={(newVal) => onChange(newVal!.utc().toISOString())}
      format={`${isDateFormatUS ? 'MM/DD' : 'DD/MM'}/YYYY hh:mm A`}
    />
  )
}

const Columns = styled.div`
  display: flex;
  align-items: center;
`
const Column = styled.div`
  padding: 0.25rem;
`
const Row = styled.div`
  padding: 0.25rem;
  display: flex;
  align-items: center;
`
const Form = styled.div`
  display: flex;
  flex-direction: column;
`
const LabelCell = styled.div`
  width: 25%;
`
const ValueCell = styled.div`
  width: 75%;
`
const Item = styled.div`
  border-radius: ${({ theme }: { theme?: CustomTheme }) =>
    theme!.shape.borderRadius}px;
  background-color: rgba(25, 25, 25);
  margin-bottom: 0.25rem;
  padding: 0.5rem;
`
const PerformanceItem = styled(Item)`
  background-color: rgba(75, 75, 75);
`

const EventDate = styled.div`
  font-size: 75%;
  text-align: center;
`

const INTERVAL_HEIGHT_PX = 10

const PerformerName = ({
  id,
  name,
}: {
  id: string | null
  name: string | null
}) => {
  const [isLoading, lastErrorCode, result] = useDataStoreItem<Performer>(
    CollectionNames.Performers,
    id || false
  )
  if (isLoading) return <LoadingIndicator message="Loading performer..." />
  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode}>
        Failed to load performer
      </ErrorMessage>
    )
  return (
    <strong>
      {result ? (
        <Link
          to={routes.viewPerformerWithVar.replace(':performerId', result.id)}>
          {result.name}
        </Link>
      ) : (
        `${name} (custom)`
      )}
    </strong>
  )
}

const PerformanceEditor = ({
  value,
  onDone,
  onMoveUp,
  onMoveDown,
  onRemove,
  onCancel,
  eventStartAt,
  prevPerf,
  ...props
}: {
  value?: Performance
  onDone: (performance: Performance) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onRemove?: () => void
  onCancel?: () => void
} & Omit<PerformanceFormProps, 'newFields'>) => {
  const [newFields, setNewFields] = useState<Partial<Performance>>(
    value || {
      performerid: undefined,
      performername: undefined,
      startsat: undefined,
      endsat: undefined,
    }
  )
  const [isEditing, setIsEditing] = useState<null | boolean>(null)

  const isValid = Boolean(
    (newFields.performerid || newFields.performername) &&
      newFields.startsat &&
      newFields.endsat
  )

  const onClickDone = async () => {
    if (!isValid) return
    setIsEditing(false)
    onDone(newFields as Performance)
  }

  return (
    <>
      <Columns>
        {isEditing === true || !value ? (
          <Column style={{ width: '95%' }}>
            <PerformanceForm
              newFields={newFields}
              onChange={(fields) => setNewFields(fields)}
              eventStartAt={eventStartAt}
              prevPerf={prevPerf}
              {...props}
            />
            {onCancel && (
              <FormControls>
                <Button color="secondary" onClick={() => onCancel()}>
                  Cancel
                </Button>
                <Button onClick={() => onClickDone()} isDisabled={!isValid}>
                  Add Performance To Event
                </Button>
              </FormControls>
            )}
          </Column>
        ) : (
          <>
            <Column style={{ width: '80%' }}>
              <div>
                Starts:{' '}
                <FormattedDate date={newFields.startsat!} isRelative={false} />{' '}
                (<FormattedDate date={newFields.startsat!} isRelative />)
              </div>
              <div>
                Performer:{' '}
                <PerformerName
                  id={newFields.performerid!}
                  name={newFields.performername!}
                />
              </div>
              <div>
                Ends:{' '}
                <FormattedDate date={newFields.endsat!} isRelative={false} /> (
                <FormattedDate date={newFields.endsat!} />)
              </div>
            </Column>
            <Column style={{ width: '20%' }}>
              <EditButton
                color="secondary"
                onClick={() => setIsEditing(true)}
              />
            </Column>
          </>
        )}
        {onMoveUp && onMoveDown && onRemove && (
          <Column style={{ width: '5%' }}>
            <div>
              <Button color="secondary" onClick={onMoveUp}>
                <ChevronUpIcon />
              </Button>
              <Button color="secondary" onClick={onRemove}>
                <DeleteIcon />
              </Button>
              <Button color="secondary" onClick={onMoveDown}>
                <ChevronDownIcon />
              </Button>
            </div>
          </Column>
        )}
      </Columns>
    </>
  )
}

interface PerformanceFormProps {
  newFields: Partial<Performance>
  onChange?: (fields: Partial<Performance>) => void
  isDisabled?: boolean
  eventStartAt: string
  prevPerf: Performance | null
}

const PerformanceForm = ({
  newFields,
  onChange,
  isDisabled,
  eventStartAt,
  prevPerf,
}: PerformanceFormProps) => {
  const updateField = (fieldName: keyof Performance, newVal: any) => {
    if (!onChange) return
    onChange({
      ...(newFields || {}),
      [fieldName]: newVal,
    })
  }
  const updateFields = (newVals: Partial<Performance>) => {
    if (!onChange) return
    onChange({
      ...(newFields || {}),
      ...newVals,
    })
  }

  const onClickAddThirty = () => {
    if (!newFields.startsat) return
    const date = new Date(newFields.startsat)
    date.setMinutes(date.getMinutes() + 30)
    updateField('startsat', date.toISOString())

    if (newFields.endsat) {
      const date = new Date(newFields.endsat)
      date.setMinutes(date.getMinutes() + 30)
      updateField('endsat', date.toISOString())
    } else {
      const date = new Date(newFields.startsat)
      date.setMinutes(date.getMinutes() + 30)
      updateField('endsat', date.toISOString())
    }
  }

  const onClickUseEventStart = () => {
    updateField('startsat', eventStartAt)
  }
  const onClickUseEndOfPrevPerf = () => {
    if (!prevPerf?.endsat) return
    updateField('startsat', prevPerf?.endsat)
  }

  return (
    <Form>
      <Row>
        <LabelCell>Starts At</LabelCell>
        <ValueCell>
          <PerformanceDateTimeInput
            value={newFields.startsat || ''}
            onChange={(newVal) => updateField('startsat', newVal)}
          />{' '}
          <Button
            size="small"
            color="secondary"
            onClick={() => onClickUseEventStart()}>
            Event Start
          </Button>{' '}
          <Button
            size="small"
            color="secondary"
            onClick={() => onClickUseEndOfPrevPerf()}
            isDisabled={prevPerf === null || !prevPerf.endsat}>
            End Of Previous Performance
          </Button>
        </ValueCell>
      </Row>
      <Row>
        <LabelCell>Performer</LabelCell>
        <ValueCell>
          <SearchableInput
            value={newFields.performerid}
            onChange={(newVal) => {
              updateFields({ performerid: newVal, performername: null })
            }}
            editableField={{
              name: 'performerid',
              type: fieldTypes.searchable,
              collectionName: CollectionNames.Performers,
              fieldAsLabel: 'name',
              renderer: ({ item }) => <PerformerResultsItem performer={item} />,
            }}
          />
          Or enter their name manually:
          <TextInput
            value={newFields.performername || ''}
            onChange={(e) => {
              updateFields({ performerid: null, performername: e.target.value })
            }}
          />
        </ValueCell>
      </Row>
      <Row>
        <LabelCell>Ends At</LabelCell>
        <ValueCell>
          <PerformanceDateTimeInput
            value={newFields.endsat || ''}
            onChange={(newVal) => updateField('endsat', newVal)}
          />
          <Button
            size="small"
            color="secondary"
            onClick={() => onClickAddThirty()}>
            +30 mins
          </Button>
        </ValueCell>
      </Row>
    </Form>
  )
}

function moveUp(ids: string[], id: string): string[] {
  const index = ids.indexOf(id)
  if (index <= 0) return ids // already first, or not found
  const newIds = [...ids]
  ;[newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]]
  return newIds
}

function moveDown(ids: string[], id: string): string[] {
  const index = ids.indexOf(id)
  if (index === -1 || index === ids.length - 1) return ids // not found, or already last
  const newIds = [...ids]
  ;[newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]]
  return newIds
}

function removeByValue<T>(arr: T[], value: T): T[] {
  return arr.filter((item) => item !== value)
}

const PerformancesEditor = ({
  value,
  onChange,
  eventStartAt,
  eventEndAt,
}: {
  value: Performance[]
  onChange: (newVal: Performance[]) => void
  eventStartAt: string
  eventEndAt: string
}) => {
  const [isCreatingAtTopOrBot, setIsCreatingAtTopOrBot] = useState<
    boolean | null
  >(null)
  const onAddToStart = () => setIsCreatingAtTopOrBot(true)
  const onAddToEnd = () => setIsCreatingAtTopOrBot(false)
  const onEdit = (idx: number, newPerf: Performance) =>
    onChange(value.map((val, i) => (i === idx ? newPerf : val)))
  const onCreate = (newPerf: Performance) => {
    onChange(value.concat([newPerf]))
    setIsCreatingAtTopOrBot(null)
  }
  const onMoveUp = (idx: number) => moveItemToLeft(value, idx)
  const onMoveDown = (idx: number) => moveItemToRight(value, idx)
  const onRemove = (idx: number) =>
    onChange(value.filter((val, i) => i !== idx))

  const firstPerf = value.length ? value[0] : null
  const lastPerf = value.length ? value[value.length - 1] : null

  return (
    <div>
      <Item>
        <EventDate>
          <FormattedDate date={eventStartAt} isRelative={false} />
        </EventDate>
      </Item>
      {isCreatingAtTopOrBot === true ? (
        <PerformanceItem>
          <PerformanceEditor
            onDone={onCreate}
            eventStartAt={eventStartAt}
            prevPerf={null}
            onCancel={() => setIsCreatingAtTopOrBot(null)}
          />
        </PerformanceItem>
      ) : (
        <Item>
          <FormControls>
            <Button icon={<AddIcon />} onClick={() => onAddToStart()}>
              Performance
            </Button>
          </FormControls>
        </Item>
      )}
      {value.length ? (
        value.map((performance, idx) => {
          const prevPerfForThis = idx > 0 ? value[idx - 1] : null
          return (
            <PerformanceItem>
              <PerformanceEditor
                value={performance}
                onDone={(newPerf) => onEdit(idx, newPerf)}
                onMoveUp={() => onMoveUp(idx)}
                onMoveDown={() => onMoveDown(idx)}
                onRemove={() => onRemove(idx)}
                eventStartAt={eventStartAt}
                prevPerf={prevPerfForThis}
              />
            </PerformanceItem>
          )
        })
      ) : (
        <NoResultsMessage>No performances yet</NoResultsMessage>
      )}
      {}
      {isCreatingAtTopOrBot === false ? (
        <PerformanceItem>
          <PerformanceEditor
            onDone={onCreate}
            eventStartAt={eventStartAt}
            prevPerf={lastPerf}
            onCancel={() => setIsCreatingAtTopOrBot(null)}
          />
        </PerformanceItem>
      ) : (
        <Item>
          <FormControls>
            <Button icon={<AddIcon />} onClick={() => onAddToEnd()}>
              Performance
            </Button>
          </FormControls>
        </Item>
      )}
      <Item>
        <EventDate>
          <FormattedDate date={eventEndAt} isRelative={false} />
        </EventDate>
      </Item>
    </div>
  )
}

export default PerformancesEditor
