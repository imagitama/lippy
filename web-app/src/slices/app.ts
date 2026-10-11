import { AnyAction, Dispatch } from 'redux'

export type SearchFilter = string

export interface AppState {
  isMenuOpen: boolean
}

const initialState: AppState = {
  isMenuOpen: false,
}

const OPEN_MENU = 'app/OPEN_MENU'
const CLOSE_MENU = 'app/CLOSE_MENU'

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
