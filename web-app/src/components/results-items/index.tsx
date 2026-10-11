import React from 'react'
import { makeStyles } from '@mui/styles'

import { mediaQueryForTabletsOrBelow } from '@/media-queries'
import ResultsItem from '@/components/results-item'

const useStyles = makeStyles({
  root: { marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap' },
  item: {
    margin: '0.5rem',
    [mediaQueryForTabletsOrBelow]: {
      margin: '0.25rem',
    },
  },
})

type Item<TItem> = TItem & {
  id: string
  linkUrl?: string
}

const ResultsItems = <TItem extends Object>({
  items,
  children,
  dimUnselected = false,
  onClickWithEventAndItem = undefined,
  shimmer = false,
  shimmerCount = 3,
  hydrate = undefined,
}: {
  items?: Item<TItem>[]
  children?: React.ReactNode[]
  dimUnselected?: boolean
  onClickWithEventAndItem?: (
    event: React.SyntheticEvent<HTMLElement>,
    item: Item<TItem>
  ) => void
  shimmer?: boolean
  shimmerCount?: number
  hydrate?: () => void
}) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {shimmer
        ? new Array(shimmerCount).fill(undefined).map(() => (
            <div className={classes.item}>
              <ResultsItem />
            </div>
          ))
        : items
        ? items.map((item) => (
            <div key={item.id} className={classes.item}>
              <ResultsItem
                {...item}
                onClick={
                  onClickWithEventAndItem
                    ? (e: React.SyntheticEvent<HTMLElement>) =>
                        onClickWithEventAndItem(e, item)
                    : undefined
                }
              />
            </div>
          ))
        : React.Children.map(children, (child, idx) => (
            <div key={idx} className={classes.item}>
              {child}
            </div>
          ))}
    </div>
  )
}

export default ResultsItems
