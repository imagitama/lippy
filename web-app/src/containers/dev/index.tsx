import React, { useState } from 'react'
import { Helmet } from '@unhead/react/helmet'
import Select, { MenuItem } from '@/components/select'
import Button from '@/components/button'
import TextInput from '@/components/text-input'
import PerformancesEditor from '@/components/performances-editor'
import { Performance } from 'shared/modules/events'

const PerformancesEditorDev = () => {
  const [val, setVal] = useState<Performance[]>([])
  const eventStartsAt = new Date().toISOString()
  const eventEndsAt = new Date().toISOString()
  return (
    <>
      {JSON.stringify(val, null, '  ')}
      <PerformancesEditor
        value={val}
        onChange={(newVal) => setVal(newVal)}
        eventStartAt={eventStartsAt}
        eventEndAt={eventEndsAt}
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
        {/* <h2>Performances Editor</h2>
        <PerformancesEditorDev /> */}
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
      </div>
    </>
  )
}
