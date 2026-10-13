import { CONTENT_MAX_WIDTH_PX } from '@/config'
import styled from '@emotion/styled'

const Root = styled.div`
  max-width: ${CONTENT_MAX_WIDTH_PX}px;
  margin: 0 auto;
`

const PageContent = ({ children }: { children: React.ReactNode }) => (
  <Root>{children}</Root>
)

export default PageContent
