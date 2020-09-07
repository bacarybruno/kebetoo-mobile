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
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  posts,
})
