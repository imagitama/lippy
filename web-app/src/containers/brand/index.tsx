import React from 'react'
import { Helmet } from '@unhead/react/helmet'

// import { colors } from '@/brand'
import Markdown from '@/components/markdown'

import { ReactComponent as Logo } from './assets/logo-v1/logo-v1.svg'
import avatarUrl from './assets/logo-v1/avatar.png'
import { DEFAULT_PAGE_DESC } from '@/config'

const rules = `# Our Brand Guide

todo`

export default () => (
  <>
    <Helmet>
      <title>View our brand</title>
      <meta
        name="description"
        content="Read about what the brand is including our colors, logo, fonts and more."
      />
    </Helmet>
    <div style={{ width: '300px' }}>
      <Logo style={{ width: '100%' }} />
    </div>
    <Markdown source={rules} enableHtml />
  </>
)
