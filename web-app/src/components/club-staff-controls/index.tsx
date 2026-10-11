import styled from '@emotion/styled'

import Paper from '../paper'
import { CONTENT_MAX_WIDTH_PX } from '@/config'
import Heading from '../heading'

const StyledClubStaffControls = styled(Paper)`
  && {
    margin: 1rem auto;
    max-width: ${CONTENT_MAX_WIDTH_PX}px;
  }
`

const ClubStaffControls = ({ children }: { children: React.ReactNode }) => (
  <StyledClubStaffControls>
    <Heading variant="h3" noTopMargin>
      Club Staff Controls
    </Heading>
    {children}
  </StyledClubStaffControls>
)

export default ClubStaffControls
