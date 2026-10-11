import React from 'react'
import { makeStyles } from '@mui/styles'
import PerformerResultsItem from '@/components/performer-results-item'
import { Performer, PerformerForList } from 'shared/modules/performers'

const useStyles = makeStyles({
  root: { marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap' },
})

const PerformerResults = ({
  performers,
  onClick,
}: {
  performers?: PerformerForList[]
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    performerId: string,
    performer: PerformerForList
  ) => void
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {performers
        ? performers.map((performer) => (
            <PerformerResultsItem
              key={performer.id}
              performer={performer}
              onClick={
                onClick ? (e) => onClick(e, performer.id, performer) : undefined
              }
            />
          ))
        : null}
    </div>
  )
}

export default PerformerResults
