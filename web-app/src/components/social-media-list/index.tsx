import styled from '@emotion/styled'
import { SocialFields } from 'shared/modules/common'
import socialInfo from './infos'
import Button from '../button'

const Root = styled.div`
  width: auto;
  margin: auto;
`
const Item = styled.div`
  width: 100%;
  padding: 0.5rem;
`

const SocialMediaList = ({ socials }: { socials: SocialFields }) => {
  return (
    <Root>
      {Object.entries(socials).map(([fieldName, val]) => {
        if (!val) return null
        const info = socialInfo.find((item) => item.name === fieldName)
        if (!info) return null
        return (
          <Item>
            <Button
              icon={info.icon || undefined}
              url={info.getUrl ? info.getUrl(val) : val}
              title="Visit the link">
              {info.label}
            </Button>
            {/* <a
              href={info.getUrl ? info.getUrl(val) : val}
              title="Visit the link"
              target="_blank"
              rel="noopener noreferrer">
              {info.icon} {info.label}
            </a> */}
          </Item>
        )
      })}
    </Root>
  )
}

export default SocialMediaList
