import * as types from '../types'

const initialState = {
  stats: {
    posts: 0,
    reactions: 0,
    comments: 0,
  },
  displayName: '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_DISPLAY_NAME:
      return {
        ...state,
        displayName: action.payload,
      }
    case types.SET_USER_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
        },
      }
    default:
      return state
  }
}

export default reducer
