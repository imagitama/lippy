import Button from '@/components/button'
import { Filter as FilterIcon } from '@/icons'
import Dialog from '@/components/dialog'
import Heading from '@/components/heading'
import TagsInput from '@/components/tags-input'
import { useState } from 'react'
import useEventFilters from '@/hooks/useEventFilters'
import { commonGenres, eventTags, lessCommonGenres, worldTags } from '@/tags'

const FilterButton = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [eventFilters, setEventFilters] = useEventFilters()

  return (
    <>
      <Button
        size="large"
        onClick={() => setIsFiltersOpen(true)}
        color="secondary"
        icon={<FilterIcon />}
        title="Open filters dialog"
      />
      {isFiltersOpen && (
        <Dialog onClose={() => setIsFiltersOpen(false)}>
          <Heading variant="h2" noTopMargin>
            Filters
          </Heading>
          <Heading variant="h3">Genres</Heading>
          Dims events that do not have these genres:
          <TagsInput
            currentTags={eventFilters.genres}
            onChange={(newTags) =>
              setEventFilters({ ...eventFilters, genres: newTags })
            }
            suggestedTags={commonGenres.concat(lessCommonGenres)}
          />
          <Heading variant="h3">Tags</Heading>
          Dims events that do not have these tags:
          <TagsInput
            currentTags={eventFilters.tags}
            onChange={(newTags) =>
              setEventFilters({ ...eventFilters, tags: newTags })
            }
            suggestedTags={eventTags.concat(worldTags)}
          />
        </Dialog>
      )}
    </>
  )
}

export default FilterButton
