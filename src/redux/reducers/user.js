import { SET_DISPLAY_NAME } from '../types'

const initialState = {
  displayName: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DISPLAY_NAME:
      return {
        ...state,
        displayName: action.payload,
      }
    default:
      return state
  }
}

export default reducer
