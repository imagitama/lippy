import useStorage from './useStorage'

const KEY = 'event-favs'

export const useEventsFavoriting = (): string[] => {
  const [existingFavIds] = useStorage<string[]>(KEY, [])
  return existingFavIds
}

const useEventFavoriting = (eventId: string): [boolean, () => void] => {
  const [existingFavIds, storeFavIds] = useStorage<string[]>(KEY, [])
  const isFaved = existingFavIds.includes(eventId)

  const toggleFav = () => {
    if (isFaved) storeFavIds(existingFavIds.filter((id) => id !== eventId))
    else storeFavIds(existingFavIds.concat([eventId]))
  }

  return [isFaved, toggleFav]
}

export default useEventFavoriting
