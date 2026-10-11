import { AnyAction, Dispatch } from 'redux'

export type SearchFilter = string

export interface AppState {
  isMenuOpen: boolean
  isAccountVerifySuccess: null | true
}

const initialState: AppState = {
  isMenuOpen: false,
  isAccountVerifySuccess: null,
}

const OPEN_MENU = 'app/OPEN_MENU'
const CLOSE_MENU = 'app/CLOSE_MENU'
const ACCOUNT_VERIFY_SUCCESS = 'auth/ACCOUNT_VERIFY_SUCCESS'

export default (
  state: AppState = initialState,
  action: AnyAction
): AppState => {
  switch (action.type) {
    case OPEN_MENU:
      return {
        ...state,
        isMenuOpen: true,
      }

    case CLOSE_MENU:
      return {
        ...state,
        isMenuOpen: false,
      }

    case ACCOUNT_VERIFY_SUCCESS:
      return {
        ...state,
        isAccountVerifySuccess: true,
      }

    default:
      return state
  }
}

export const openMenu = () => (dispatch: Dispatch) => {
  dispatch({
    type: OPEN_MENU,
  })
}

export const closeMenu = () => (dispatch: Dispatch) => {
  dispatch({
    type: CLOSE_MENU,
  })
}

export const accountVerifySuccess = () => (dispatch: Dispatch) => {
  dispatch({
    type: ACCOUNT_VERIFY_SUCCESS,
  })
}
