import React from 'react'
import { Helmet } from '@unhead/react/helmet'

import Markdown from '@/components/markdown'

import { ReactComponent as Logo } from '@/assets/images/logo_v1.svg'
import logoUrl from '@/assets/images/logo_v1.svg?url'
import { colorBrand } from '@/themes'
import Link from '@/components/link'

const rules = `# Our Brand Guide

TODO

## Colors

| Name | Value | Usage/Desc |
|---|---|---|
| Brand | ${colorBrand} <span style="display: inline-block; width: 10px; height: 10px; background-color: ${colorBrand};"></span> | |
`

export default () => (
  <>
    <Helmet>
      <title>View our brand</title>
      <meta
        name="description"
        content="Read about what the brand is including our colors, logo, fonts and more."
      />
    </Helmet>
    <div style={{ width: '200px' }}>
      Logo SVG:
      <Logo style={{ width: '100%' }} />
      <a href={logoUrl}>Link</a>
    </div>
    <Markdown source={rules} enableHtml />
  </>
)
