import { FullUser } from 'shared/modules/users'
import Tabs from '../tabs'
import UserOverview from '../user-overview'
import UserOverviewContext from '../user-overview/context'

import TabComments from '../user-overview/components/tab-comments'
import TabAttachments from '../user-overview/components/tab-attachments'
import TabHistory from '../user-overview/components/tab-history'

const UserOverviewForEditor = ({ user }: { user: FullUser }) => {
  return (
    <UserOverviewContext.Provider value={{ userId: user.id, user }}>
      <Tabs
        items={[
          {
            name: 'overview',
            label: 'Non-Staff',
            contents: <UserOverview user={user} />,
          },

          {
            name: 'assets',
            label: 'Comments',
            contents: TabComments,
          },
          {
            name: 'reviews',
            label: 'Attachments',
            contents: TabAttachments,
          },
          {
            name: 'reviews',
            label: 'History',
            contents: TabHistory,
          },
        ]}
      />
    </UserOverviewContext.Provider>
  )
}

export default UserOverviewForEditor
