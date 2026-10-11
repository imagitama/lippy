import React from 'react'
import { Helmet } from '@unhead/react/helmet'

import Markdown from '@/components/markdown'
import { EMAIL } from '@/config'
import * as routes from '@/routes'

const rules = `# Takedown Policy

todo`
// const rules = `# Takedown Policy

// ## How do I takedown some content on this site?

// Copyrighted material such as thumbnails, screenshots and videos of your content are permitted on this website under [copyright fair use](https://www.copyright.gov/fair-use/more-info.html) because:

// 1. This website is not for profit and is meant for educational purposes
// 2. Each asset is a technical description of the asset and re-uses existing texts from the source
// 3. We rarely host the actual 3D asset so we only use a small amount of copyrighted material such as images
// 4. Assets on this site are designed to market and promote the source instead of hurt its sales and market value

// The only way to truly remove an asset from this site is you can **prove you are the original creator of the asset** and you either:

// 1. Submit a valid and legal DMCA claim ([do it here]([URL]${routes.dmcaPolicy}))
// 2. Can prove the source of your asset has been removed from public access (such as the Gumroad store page has been removed or a direct link should not be accessible)

// In the case of point 2 please use the standard "Report" button available on every asset and select the "Takedown" option.

// ## Questions about this policy

// You can forward any and all questions about this policy to the website owner and administrator via email at ${EMAIL}`

export default () => (
  <>
    <Helmet>
      <title>View takedown policy</title>
      <meta
        name="description"
        content="Read our policy on taking down content from the site."
      />
    </Helmet>
    <Markdown source={rules} />
  </>
)
