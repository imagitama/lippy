import React from 'react'
import styled from '@emotion/styled'
import { Delete as DeleteIcon } from '@/icons'
import NoValueLabel from '../no-value-label'

const StyledTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Item = styled.div`
  color: rgba(255, 255, 255, 0.5);
  margin-right: 0.3rem;
`

const HighlightedItem = styled(Item)`
  font-weight: bold;
  text-transform: uppercase;
`

const ClickableItem = styled.div`
  margin: 0 0.25rem 0.25rem 0;
  &:last-child {
    margin: 0;
  }
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  height: 2rem;
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.5);
  }
`

const TagList = ({
  tags,
  onClick,
  onDelete,
  highlightTags,
}: {
  tags: string[]
  onClick?: (tag: string) => void
  onDelete?: (tag: string) => void
  highlightTags?: string[]
}) => {
  if (!tags.length) return <NoValueLabel>(no tags)</NoValueLabel>
  return (
    <StyledTagList>
      {onClick || onDelete
        ? tags.map((tag) => (
            <ClickableItem
              key={tag}
              onClick={() => (onClick ? onClick(tag) : onDelete!(tag))}>
              {onDelete && <DeleteIcon />}
              {tag}
            </ClickableItem>
          ))
        : tags.map((tag) =>
            highlightTags?.includes(tag) ? (
              <HighlightedItem key={tag}>{tag}</HighlightedItem>
            ) : (
              <Item key={tag}>{tag}</Item>
            )
          )}
    </StyledTagList>
  )
}

export default TagList
