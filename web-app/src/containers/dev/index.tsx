import React, { useState } from 'react'
import { Helmet } from '@unhead/react/helmet'
import Select, { MenuItem } from '@/components/select'
import Button from '@/components/button'
import TextInput from '@/components/text-input'
import PerformancesEditor from '@/components/performances-editor'
import { Performance } from 'shared/modules/events'
import PasswordInput from '@/components/password-input'

const PerformancesEditorDev = () => {
  const [val, setVal] = useState<Performance[]>([])
  const MINUTE_MS = 60 * 1000
  const HOUR_MS = 60 * MINUTE_MS

  const [eventStartsAt] = useState(() =>
    new Date(Math.round(Date.now() / MINUTE_MS) * MINUTE_MS).toISOString()
  )
  const [eventEndsAt] = useState(() =>
    new Date(
      Math.round((Date.now() + HOUR_MS) / MINUTE_MS) * MINUTE_MS
    ).toISOString()
  )
  return (
    <>
      Event starts at: {eventStartsAt}
      <br />
      Event ends at: {eventEndsAt}
      <br />
      Performances: {JSON.stringify(val, null, '  ')}
      <br />
      <br />
      <PerformancesEditor
        value={val}
        onChange={(newVal) => setVal(newVal)}
        eventStartsAt={eventStartsAt}
        eventEndsAt={eventEndsAt}
      />
    </>
  )
}

export default () => {
  return (
    <>
      <Helmet>
        <title>Development area</title>
        <meta name="description" content="Internal use." />
      </Helmet>
      <div>
        <h1>Forms</h1>
        <h2>Performances Editor</h2>
        <PerformancesEditorDev />
        <h2>Basic Components (Default Size)</h2>
        <Button>Click Me</Button>{' '}
        <Select label="Here We Go" button={<Button>Click Me</Button>}>
          <MenuItem value="">Nothing</MenuItem>
          <MenuItem value="Some option">Some option</MenuItem>
        </Select>{' '}
        <TextInput label="Type In Me" button={<Button>Click Me</Button>} />
        <h1>Forms</h1>
        <h2>Basic Components (Default Size)</h2>
        <Button>Click Me</Button>{' '}
        <Select label="Here We Go" button={<Button>Click Me</Button>}>
          <MenuItem value="">Nothing</MenuItem>
          <MenuItem value="Some option">Some option</MenuItem>
        </Select>{' '}
        <TextInput label="Type In Me" button={<Button>Click Me</Button>} />
        <PasswordInput label="Password" value="abc" onChange={(val) => {}} />
      </div>
    </>
  )
}
