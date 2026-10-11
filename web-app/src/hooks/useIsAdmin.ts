import { UserRoles } from 'shared/modules/users'
import useUserRecord from './useUserRecord'

export default (): boolean | null => {
  const [, , user] = useUserRecord()
  return user && user.role === UserRoles.Admin
}
