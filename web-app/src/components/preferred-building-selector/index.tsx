import styled from '@emotion/styled'
import { colorGrey, CustomTheme } from '@/themes'
import CheckboxInput from '../checkbox-input'

import brutalist_bunker_1 from './screenshots/brutalist_bunker_1.webp'
import contemporary_modern_1 from './screenshots/contemporary_modern_1.webp'
import minimalist_monolith_1 from './screenshots/minimalist_monolith_1.webp'
import repurposed_office_1 from './screenshots/repurposed_office_1.webp'

const Root = styled.div`
  display: flex;
  user-select: none;
`

const BuildingSelector = styled.div`
  flex: 1;
  border: 1px solid ${colorGrey};
  border-radius: ${({ theme }: { theme?: CustomTheme }) =>
    theme!.shape.borderRadius};
  padding: 0.25rem;
  cursor: pointer;

  margin: 0 0.25rem;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }

  & img {
    width: 100%;
  }

  & label {
    margin-left: 0;
  }
`

const buildings = [
  {
    imageUrl: brutalist_bunker_1,
    name: 'brutalist_bunker_1',
  },
  {
    imageUrl: contemporary_modern_1,
    name: 'contemporary_modern_1',
  },
  {
    imageUrl: minimalist_monolith_1,
    name: 'minimalist_monolith_1',
  },
  {
    imageUrl: repurposed_office_1,
    name: 'repurposed_office_1',
  },
]

const PreferredBuildingSelector = ({
  value,
  onChange,
}: {
  value: string | null
  onChange: (newVal: string | null) => void
}) => {
  return (
    <Root>
      {buildings.map(({ name, imageUrl }) => (
        <BuildingSelector
          key={name}
          onClick={() => onChange(name === value ? null : name)}>
          <img src={imageUrl} alt={`Screenshot of building ${name}`} />
          <CheckboxInput
            value={name === value}
            label={name}
            onChange={() => onChange(name === value ? null : name)}
          />
        </BuildingSelector>
      ))}
    </Root>
  )
}

export default PreferredBuildingSelector
