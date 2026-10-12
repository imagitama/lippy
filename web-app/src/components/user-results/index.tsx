import React from 'react'
import { makeStyles } from '@mui/styles'

import { UserForList } from 'shared/modules/users'
import UserResultsItem from '@/components/user-results-item'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
})

const UserResults = ({
  users,
  showSignupDate = true,
}: {
  users?: UserForList[]
  showSignupDate?: boolean
}) => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      {users
        ? users.map((user) => (
            <UserResultsItem
              key={user.id}
              user={user}
              showSignupDate={showSignupDate}
            />
          ))
        : null}
    </div>
  )
}

export default UserResults
