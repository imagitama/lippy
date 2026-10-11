import React from 'react'
import { Helmet } from '@unhead/react/helmet'
import AddIcon from '@mui/icons-material/Add'

import * as routes from '@/routes'

import useIsModerator from '@/hooks/useIsModerator'

import AllTagsBrowser from '@/components/all-tags-browser'
import Button from '@/components/button'
import Heading from '@/components/heading'
import EditorBox from '@/components/editor-box'

export default () => {
  const isMod = useIsModerator()
  return (
    <>
      <Helmet>
        <title>Browse tags</title>
        <meta
          name="description"
          content={`See a list of all of the popular tags used on the site.`}
        />
      </Helmet>
      <Heading variant="h1">Browse tags</Heading>
      {isMod && (
        <EditorBox title="Editor Controls">
          <Button url={routes.createTag} icon={<AddIcon />} color="secondary">
            Create Tag
          </Button>
        </EditorBox>
      )}
      <AllTagsBrowser />
    </>
  )
}
