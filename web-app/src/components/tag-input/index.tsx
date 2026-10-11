import React, { useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

import { getTagFromUserInput } from '@/utils/tags'
import { FullTag } from 'shared/modules/tags'

import useDelimit from '@/hooks/useDelimit'
import useDataStore from '@/hooks/useDataStore'
import useIsAdultContentEnabled from '@/hooks/useIsAdultContentEnabled'

import AutocompleteInput, {
  AutocompleteOption,
} from '@/components/autocomplete-input'

interface Suggestion {
  id: string
  text: string
}

const suggestions: Suggestion[] = []

const filterSuggestions = (
  suggestions: Suggestion[],
  textInput: string
): Suggestion[] =>
  suggestions.sort((a, b) => {
    const aIncludesInput = String(a.id).includes(textInput)
    const bIncludesInput = String(b.id).includes(textInput)

    if (aIncludesInput && !bIncludesInput) {
      return -1
    } else if (!aIncludesInput && bIncludesInput) {
      return 1
    } else {
      return 0
    }
  })

enum FunctionNames {
  AutocompleteTags = 'autocompletetags',
}

const TagInput = ({
  isDisabled,
  autoComplete = true,
  onNewTag,
  existingTags,
}: {
  isDisabled?: boolean
  autoComplete?: boolean
  onNewTag: (tagName: string) => void
  existingTags?: string[]
}) => {
  const [textInput, setTextInput] = useState('')
  const isAdultContentEnabled = useIsAdultContentEnabled()

  const getQuery = useDelimit(
    (supabase: SupabaseClient) => {
      if (textInput.length < 2 || !autoComplete) {
        return null
      }

      // TODO: use hook
      let query = supabase
        .rpc<any, FullTag>(FunctionNames.AutocompleteTags, {
          input: textInput,
          include_adult: isAdultContentEnabled,
        })
        .select('*')

      return query
    },
    [textInput, isAdultContentEnabled, autoComplete]
  )

  const [isLoading, , searchResults] = useDataStore<FullTag>(getQuery)

  const autoCompleteOptions = autoComplete
    ? ([] as AutocompleteOption<any>[])
        .concat(
          searchResults
            ? searchResults
                .filter((tagInfo) =>
                  existingTags ? !existingTags.includes(tagInfo.id) : true
                )
                .map((tagInfo) => ({
                  data: tagInfo.id,
                  label: `${tagInfo.id} (${tagInfo.count || 0})`,
                }))
            : []
        )
        .concat(
          textInput.length > 1
            ? (
                [
                  {
                    data: '',
                    label: 'Category or area:',
                    isDisabled: true,
                  },
                ] as AutocompleteOption<any>[]
              ).concat(
                filterSuggestions(suggestions, textInput)
                  .slice(0, 4)
                  .map((suggestion) => ({
                    data: suggestion.id,
                    label: suggestion.text,
                  }))
              )
            : []
        )
    : []

  return (
    // wrap in div for styling
    <div>
      <AutocompleteInput
        value={textInput}
        onNewValue={(newValue) => setTextInput(newValue)}
        options={autoCompleteOptions}
        onSelectedOption={(option) => {
          setTextInput('')
          onNewTag(getTagFromUserInput(option.data))
        }}
        label={isLoading ? 'Searching...' : 'Start typing a tag...'}
        textFieldProps={{
          fullWidth: true,
          disabled: isDisabled,
          size: 'small',
        }}
      />
    </div>
  )
}

export default TagInput
