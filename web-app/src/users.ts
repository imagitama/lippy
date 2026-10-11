// TODO: Move to utils/users.ts

import { callFunction } from '@/supabase'

export const saveLastLoggedInDate = (userId: string) =>
  callFunction('onLogin', { userId })
