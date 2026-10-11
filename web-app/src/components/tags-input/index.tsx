import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import styled from '@emotion/styled'

import FormControls from '@/components/form-controls'
import Button from '@/components/button'
import TagList from '@/components/tag-list'
import NoResultsMessage from '@/components/no-results-message'
import { commonGenres, eventTags, lessCommonGenres, worldTags } from '@/tags'
import TextInput from '../text-input'

const useStyles = makeStyles({
  fullWidth: {
    width: '100%',
  },
  recommendedTags: {
    marginBottom: '1rem',
  },
  textInput: {
    width: '100%',
    margin: '0.5rem 0',
  },
  btns: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  category: {
    padding: '0.25rem 0.5rem 0.25rem 0.5rem',
    margin: '0.25rem',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
  },
  categoryName: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  hint: {
    fontSize: '75%',
    textAlign: 'center',
    display: 'block',
    fontWeight: 'bold',
  },
  btn: {
    '&&': {
      marginTop: '0.25rem',
    },
  },
})

const RecommendedTags = ({ onClick }: { onClick: (tag: string) => void }) => {
  return (
    <>
      <strong>Common Genres</strong>
      <TagList tags={commonGenres} onClick={onClick} />
      <strong>Less Common Genres</strong>
      <TagList tags={lessCommonGenres} onClick={onClick} />
      <strong>Event</strong>
      <TagList tags={eventTags} onClick={onClick} />
      <strong>Event World</strong>
      <TagList tags={worldTags} onClick={onClick} />
    </>
  )
}

const TagInput = ({ onNewTag }: { onNewTag: (tag: string) => void }) => {
  const [textVal, setTextVal] = useState('')
  const onAdd = () => {
    setTextVal('')
    onNewTag(textVal.trim())
  }
  return (
    <TextInput
      value={textVal}
      onChange={(e) => setTextVal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onAdd()
        }
      }}
      button={<Button onClick={onAdd}>Add</Button>}
    />
  )
}

const SuggestedTagsWrapper = styled.div`
  margin-top: 0.25rem;
`

export interface TagsInputSettings {
  showRecommendedTags?: boolean
  autoComplete?: boolean
  showSuggestButton?: boolean
  suggestedTags?: string[]
}

const TagsInput = ({
  currentTags = [],
  onChange = undefined,
  onDone = undefined,
  showRecommendedTags = false,
  isDisabled = false,
  fullWidth = false,
  autoComplete = true,
  showSuggestButton = true,
  suggestedTags,
}: {
  currentTags?: string[]
  onChange?: (newTags: string[]) => void
  onDone?: (newTags: string[]) => void
  fullWidth?: boolean
  isDisabled?: boolean
} & TagsInputSettings) => {
  const [newTags, setNewTags] = useState(currentTags || [])
  const classes = useStyles()

  useEffect(() => {
    if (currentTags) {
      setNewTags(currentTags)
    }
  }, [currentTags ? currentTags.join('+') : null])

  const addTag = (tag: string) => {
    if (newTags.includes(tag)) {
      return
    }

    const newVal = newTags.concat(tag)

    setNewTags(newVal)

    onChange && onChange(newVal)
  }

  const removeTag = (tagToRemove: string) => {
    const newVal = newTags.filter((tag) => tag !== tagToRemove)

    setNewTags(newVal)

    onChange && onChange(newVal)
  }

  const onDoneClick = () => {
    if (onDone) {
      onDone(newTags)
    }
  }

  return (
    <div className={`${fullWidth ? classes.fullWidth : ''}`}>
      {newTags.length ? (
        <TagList tags={newTags} onDelete={removeTag} />
      ) : (
        <NoResultsMessage>No tags yet</NoResultsMessage>
      )}
      <div>
        <TagInput onNewTag={addTag} />
      </div>
      {showRecommendedTags && <RecommendedTags onClick={addTag} />}
      {suggestedTags && (
        <SuggestedTagsWrapper>
          <TagList tags={suggestedTags} onClick={addTag} />
        </SuggestedTagsWrapper>
      )}
      {/* {showSuggestButton && (
        <div>
          <Button
            url={routes.createTagSuggestion}
            color="secondary"
            hollow={false}
            title="Do you have an idea for a new official tag? Or dislike an existing one? You can suggest it by clicking this button.">
            Suggest Tag Change
          </Button>
          <br />
          *redirects to page (ensure your asset is saved)
        </div>
      )} */}
      {/* {suggestedTags && (
        <>
          Suggested tags:{' '}
          <TagList tags={suggestedTags} onAdd={(tag) => addTag(tag)} />
        </>
      )} */}
      {onDone && (
        <FormControls>
          <Button onClick={onDoneClick} isDisabled={isDisabled}>
            Done
          </Button>
        </FormControls>
      )}
    </div>
  )
}

export default TagsInput
