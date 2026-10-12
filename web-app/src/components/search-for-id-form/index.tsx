import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import styled from '@emotion/styled'

import useSearching from '@/hooks/useSearching'
import { CollectionNames as UsersCollectionNames } from 'shared/modules/users'
import { CollectionNames as TagsCollectionNames } from 'shared/modules/tags'
import {
  ViewNames as ClubsViewNames,
  CollectionNames as ClubsCollectionNames,
} from 'shared/modules/clubs'
import {
  ViewNames as PerformersViewNames,
  CollectionNames as PerformersCollectionNames,
} from 'shared/modules/performers'
import {
  ViewNames as CommentsViewNames,
  CollectionNames as CommentsCollectionNames,
} from 'shared/modules/comments'

import TextInput from '@/components/text-input'
import Button from '@/components/button'
import ErrorMessage from '@/components/error-message'
import LoadingIndicator from '@/components/loading-indicator'
import NoResultsMessage from '@/components/no-results-message'

const useStyles = makeStyles({
  textInput: {
    width: '100%',
  },
  row: {
    marginTop: '0.5rem',
    '&:first-child': {
      marginTop: 0,
    },
  },
  assets: {
    display: 'flex',
  },
  button: {
    margin: '0 0.5rem 0.5rem 0',
  },
  results: {
    marginTop: '0.25rem',
    display: 'flex',
    flexWrap: 'wrap',
  },
})

const SearchResults = styled.div`
  // display: flex;
  // align-items: center;
`

// TODO: Use enums and types
const getSearchStatementForCollectionName = (collectionName: string) => {
  switch (collectionName) {
    case UsersCollectionNames.Users:
      return `username, avatarurl`
    case ClubsCollectionNames.Clubs:
      return `name, avatarurl`
    case PerformersCollectionNames.Performers:
      return `name`
    case TagsCollectionNames.Tags:
      return 'id'
    default:
      throw new Error(
        `Cannot get search statement: index ${collectionName} not configured!`
      )
  }
}

// TODO: Use enums and types
const getFieldsToSearchForCollectionName = (
  collectionName: string
): string[] => {
  switch (collectionName) {
    case UsersCollectionNames.Users:
      return ['username']
    case ClubsCollectionNames.Clubs:
      return ['name']
    case PerformersCollectionNames.Performers:
      return ['name']
    case TagsCollectionNames.Tags:
      return ['id']
    default:
      throw new Error(
        `Cannot get search statement: index ${collectionName} not configured!`
      )
  }
}

const getTableOrViewNameForCollectionName = (collectionName: string) => {
  switch (collectionName) {
    case ClubsCollectionNames.Clubs:
      return ClubsViewNames.GetPublicClubs
    case CommentsCollectionNames.Comments:
      return CommentsViewNames.GetPublicComments
    default:
      return collectionName
  }
}

type SearchResult = { [prop: string]: any }

function SearchForm({
  collectionName,
  searchTerm,
  fieldAsLabel,
  onClickWithIdAndDetails,
  renderer: Renderer = undefined,
}: {
  existingId?: string
  collectionName: string
  searchTerm: string
  fieldAsLabel?: string
  onClickWithIdAndDetails: (id: string, details: any) => void
  renderer?: (props: { result: any; onClick: () => void }) => React.ReactElement
}) {
  const [isSearching, lastErrorCode, results, clear] =
    useSearching<SearchResult>(
      getTableOrViewNameForCollectionName(collectionName),
      searchTerm,
      getSearchStatementForCollectionName(collectionName),
      getFieldsToSearchForCollectionName(collectionName)
    )

  const classes = useStyles()

  if (isSearching) {
    return <LoadingIndicator message="Searching..." />
  }

  if (lastErrorCode !== null) {
    return (
      <ErrorMessage errorCode={lastErrorCode}>Faileld to search</ErrorMessage>
    )
  }

  if (!results) {
    return null
  }

  if (!results.length) {
    return <NoResultsMessage>No results found</NoResultsMessage>
  }

  return (
    <SearchResults>
      <strong>Select a search result:</strong>
      <div className={classes.results}>
        {results.map((result) =>
          Renderer ? (
            <Renderer
              key={result.id}
              result={result}
              onClick={() => {
                onClickWithIdAndDetails(result.id, result)
                clear()
              }}
            />
          ) : (
            <Button
              key={result.id}
              onClick={() => {
                onClickWithIdAndDetails(result.id, result)
                clear()
              }}
              color="secondary"
              className={classes.button}>
              {fieldAsLabel ? result[fieldAsLabel] : '(no label)'}
            </Button>
          )
        )}
      </div>
    </SearchResults>
  )
}

export default ({
  label = 'Search',
  collectionName,
  fieldAsLabel,
  onClickWithIdAndDetails,
  renderer = undefined,
}: {
  label?: string
  collectionName: string
  fieldAsLabel?: string
  onClickWithIdAndDetails: (id: string, details: any) => void
  renderer?: (props: { result: any; onClick: () => void }) => React.ReactElement
}) => {
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const classes = useStyles()

  return (
    <>
      {searchTerm && (
        <div className={classes.row}>
          <SearchForm
            collectionName={collectionName}
            searchTerm={searchTerm}
            fieldAsLabel={fieldAsLabel}
            onClickWithIdAndDetails={onClickWithIdAndDetails}
            renderer={renderer}
          />
        </div>
      )}

      <div className={classes.row}>
        <TextInput
          label={label}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm || ''}
          className={classes.textInput}
          placeholder="Enter a search term"
        />
      </div>
    </>
  )
}
