import useStorage from './useStorage'

const KEY = 'event-filters'

interface EventFilters {
  genres: string[]
  tags: string[]
}

const useEventFilters = (): [
  EventFilters,
  (newFilter: EventFilters) => void
] => {
  const [currentFilters, setFilters] = useStorage<EventFilters>(KEY, {
    genres: [],
    tags: [],
  })

  return [currentFilters, setFilters]
}

export default useEventFilters
