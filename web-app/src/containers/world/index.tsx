import BodyText from '@/components/body-text'
import Heading from '@/components/heading'
import { Helmet } from '@unhead/react/helmet'

const World = () => {
  return (
    <>
      <Helmet>
        <title>The VRChat World</title>
        <meta name="description" content="How the VRChat world works." />
      </Helmet>
      <Heading variant="h1">VRChat World</Heading>
      <Heading variant="h2">How the VRChat world works</Heading>
      <ol>
        <li>Create an event</li>
        <li>
          Every 30 minutes the world takes any event that starts within 2 hours
          or has ended within 1 hour ago, collates their posters into a large
          square texture, and caches it
        </li>
        <li>
          When the host joins (and every 5 mins after that) they download the
          cached events and notifies the other players in the world of the new
          event data and posters
        </li>
      </ol>
      <Heading variant="h2">My event or image are wrong!</Heading>
      <BodyText>Report it in our Discord server.</BodyText>
      <Heading variant="h2">Feedback/bugs</Heading>
      <BodyText>
        Please join our Discord server and submit bug reports and feedback
        there.
      </BodyText>
    </>
  )
}

export default World
