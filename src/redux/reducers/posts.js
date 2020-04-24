/* eslint-disable no-case-declarations */
import * as types from '../types'

const initialState = {
  posts: [],
  authors: {},
  refreshing: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CLEAR_POSTS:
      return {
        ...state,
        posts: [],
      }
    case types.API_FETCH_POSTS_SUCCESS:
      return {
        ...state,
        posts: [
          ...state.posts,
          ...action.payload,
        ],
      }
    case types.API_FETCH_AUTHORS_SUCCESS:
      return {
        ...state,
        authors: { ...action.payload },
      }
    case types.API_REFRESH_POSTS_PENDING:
      return {
        ...state,
        refreshing: true,
      }
    case types.API_REFRESH_POSTS_SUCCESS:
      return {
        ...state,
        refreshing: false,
      }
    case types.REPLACE_POST:
      const posts = [...state.posts]
      const index = posts.findIndex((post) => post.id === action.payload.id)
      posts[index] = action.payload
      return {
        ...state,
        posts,
      }
    default:
      return state
  }
}

export default reducer
