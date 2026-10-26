import Heading from '@/components/heading'
import WorldData from './components/data'
import WorldTracking from './components/tracking'
import Tabs from '@/components/tabs'

const World = () => {
  return (
    <>
      <Heading variant="h1">World</Heading>
      <Tabs
        horizontal
        items={[
          {
            name: 'data',
            label: 'Data',
            contents: WorldData,
          },
          {
            name: 'tracking',
            label: 'Tracking',
            contents: WorldTracking,
          },
        ]}
      />
    </>
  )
}

export default World
