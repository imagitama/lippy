import React from 'react'
import { makeStyles } from '@mui/styles'
import ClubResultsItem from '@/components/club-results-item'
import { Club, ClubForList } from 'shared/modules/clubs'

const useStyles = makeStyles({
  root: { marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap' },
})

const ClubResults = ({
  clubs,
  onClick,
}: {
  clubs?: ClubForList[]
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    clubId: string,
    club: ClubForList
  ) => void
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {clubs
        ? clubs.map((club) => (
            <ClubResultsItem
              key={club.id}
              club={club}
              onClick={onClick ? (e) => onClick(e, club.id, club) : undefined}
            />
          ))
        : null}
    </div>
  )
}

export default ClubResults
