import styled from '@emotion/styled'
import { SocialFields } from 'shared/modules/common'
import socialInfo from './infos'
import Button from '../button'

const Root = styled.div``
const Item = styled.div`
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
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
            {info.getUrl ? (
              <Button
                icon={info.icon || undefined}
                url={info.getUrl(val)}
                title="Visit the link">
                {info.label}
              </Button>
            ) : (
              <span>
                {info.label}: {val}
              </span>
            )}
          </Item>
        )
      })}
    </Root>
  )
}

export default SocialMediaList
