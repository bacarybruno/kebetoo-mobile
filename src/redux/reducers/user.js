import * as types from '../types'

const initialState = {
  stats: {
    posts: 0,
    reactions: 0,
    comments: 0,
  },
  displayName: '',
  searchHistory: {
    posts: [],
    users: [],
  },
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
    case types.ADD_POST_HISTORY:
      return {
        ...state,
        searchHistory: {
          ...state.searchHistory,
          posts: [
            action.payload,
            ...state.searchHistory.posts.filter((post) => post !== action.payload),
          ],
        },
      }
    case types.CLEAR_POST_HISTORY:
      return {
        ...state,
        searchHistory: {
          ...state.searchHistory,
          posts: [],
        },
      }
    case types.REMOVE_POST_HISTORY:
      return {
        ...state,
        searchHistory: {
          ...state.searchHistory,
          posts: state.searchHistory.posts.filter((post) => post !== action.payload),
        },
      }
    case types.ADD_USER_HISTORY:
      return {
        ...state,
        searchHistory: {
          ...state.searchHistory,
          users: [
            action.payload,
            ...state.searchHistory.users.filter((user) => user !== action.payload),
          ],
        },
      }
    case types.CLEAR_USER_HISTORY:
      return {
        ...state,
        searchHistory: {
          ...state.searchHistory,
          users: [],
        },
      }
    case types.REMOVE_USER_HISTORY:
      return {
        ...state,
        searchHistory: {
          ...state.searchHistory,
          users: state.searchHistory.users.filter((user) => user !== action.payload),
        },
      }
    default:
      return state
  }
}

export default reducer
