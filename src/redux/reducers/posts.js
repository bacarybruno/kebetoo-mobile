import { combineReducers } from 'redux'

import { mergeObjects } from 'Kebetoo/src/shared/helpers/object'

import * as types from '../types'

const initialState = {
  posts: {},
  authors: {},
}

const posts = (state = initialState.posts, action) => {
  switch (action.type) {
    case types.API_FETCH_POSTS_SUCCESS:
      return mergeObjects(state, action.payload)
    case types.REPLACE_POSTS:
      return action.payload
    default:
      return state
  }
}

const authors = (state = initialState.authors, action) => {
  switch (action.type) {
    case types.API_FETCH_AUTHORS_SUCCESS:
      return mergeObjects(state, action.payload)
    default:
      return state
  }
}

export default combineReducers({
  posts,
  authors,
})
