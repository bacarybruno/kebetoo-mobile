import { combineReducers } from 'redux'

import { mergeArrays } from '@app/shared/helpers/object'

import * as types from '../types'

const initialState = {
  posts: [],
}

const posts = (state = initialState.posts, action) => {
  switch (action.type) {
    case types.API_FETCH_POSTS_SUCCESS:
      return mergeArrays(state, action.payload)
    case types.REPLACE_POSTS:
      return mergeArrays([], action.payload)
    case types.HIDE_POST:
      return state.filter((post) => post.id !== action.payload.id)
    case types.BLOCK_AUTHOR:
      return state.filter((post) => post.author.id !== action.payload.author.id)
    default:
      return state
  }
}

export default combineReducers({
  posts,
})
