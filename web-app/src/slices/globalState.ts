import { SupabaseClient } from '@supabase/supabase-js'
import { Action, Dispatch } from 'redux'

import { Notice } from 'shared/modules/notices'
import {
  DataStoreErrorCode,
  getDataStoreErrorCodeFromError,
  readAllRecords,
} from '@/data-store'
import { handleError } from '@/error-handling'

export interface GlobalState extends Record<string, any> {
  // global
  notices: Notice[]
}

export interface GlobalStateSlice {
  globalState: GlobalState | null
  isLoading: boolean
  errorCode: DataStoreErrorCode | null
}

enum ViewNames {
  GetGlobalState = 'getglobalstate',
}

const SET_IS_LOADING = 'globalState/SET_IS_LOADING'
const SET_ERROR_CODE = 'globalState/SET_ERROR_CODE'
const SET_GLOBAL_STATE = 'globalState/SET_GLOBAL_STATE'

const initialState: GlobalStateSlice = {
  isLoading: false,
  errorCode: null,
  globalState: null,
}

export const reducer = (
  state: GlobalStateSlice = initialState,
  action: Action
): GlobalStateSlice => {
  switch (action.type) {
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: (action as ReturnType<typeof setIsLoading>).payload
          .isLoading,
      }
    case SET_ERROR_CODE:
      return {
        ...state,
        errorCode: (action as ReturnType<typeof setErrorCode>).payload
          .errorCode,
      }
    case SET_GLOBAL_STATE:
      return {
        ...state,
        globalState: (action as ReturnType<typeof setGlobalState>).payload
          .globalState,
      }
    default:
      return state
  }
}

export const hydrateGlobalState =
  (client: SupabaseClient) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(setIsLoading(true))

      const results = await readAllRecords<GlobalState>(
        client,
        ViewNames.GetGlobalState
      )

      if (!results || results.length !== 1) {
        throw new Error(`Failed to hydrate global state: invalid results`)
      }

      dispatch(setIsLoading(false))
      dispatch(setGlobalState(results[0]))
    } catch (err) {
      console.error(err)
      handleError(err)

      dispatch(setIsLoading(false))
      dispatch(setErrorCode(getDataStoreErrorCodeFromError(err)))
    }
  }

export const setIsLoading = (isLoading: boolean) => ({
  type: SET_IS_LOADING,
  payload: {
    isLoading,
  },
})

export const setErrorCode = (errorCode: DataStoreErrorCode | null) => ({
  type: SET_ERROR_CODE,
  payload: {
    errorCode,
  },
})

export const setGlobalState = (globalState: GlobalState | null) => ({
  type: SET_GLOBAL_STATE,
  payload: {
    globalState,
  },
})
