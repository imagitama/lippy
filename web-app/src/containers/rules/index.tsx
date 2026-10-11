import React from 'react'
import { Helmet } from '@unhead/react/helmet'

import Markdown from '@/components/markdown'
import { nsfwRules } from '@/config'

const rules = `# Guidelines for using this site

**Note these guidelines are separate to our Privacy Policy and Terms of Service (available via a link in our footer).**

## General usage

- do not spam such as:
  - sending the same comment many times for no reason
  - submitting the same asset many times for no reason

- do not abuse other people such as:
  - racism, homophobic remarks, etc.
  - sending threats

## Submitting content

- do not submit adult (NSFW) content without flagging the content as adult (NSFW) content

- do not submit content with the aim of deceiving people (such as claiming it is your own work when it isn't)

- do not submit content that are intended to abuse people such as:
  - "crasher" avatars that intend to crash other players in VRChat, etc.
  - racist, homophobic, etc.
  - ones that intend to induce a medical condition such as seizures

## NSFW Content

${nsfwRules}
`

export default () => (
  <>
    <Helmet>
      <title>Rules</title>
      <meta
        name="description"
        content="Rules for submitting content and using the site."
      />
    </Helmet>
    <Markdown source={rules} />
  </>
)
