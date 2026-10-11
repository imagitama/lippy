import { createContext } from 'react'
import { FullUser } from 'shared/modules/users'

const context = createContext<{ userId: string; user: FullUser }>(
  undefined as any
)

export default context
