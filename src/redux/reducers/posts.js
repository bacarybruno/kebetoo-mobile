import { combineReducers } from 'redux'

import { mergeArrays } from '@app/shared/helpers/object'

import * as types from '../types'

const initialState = {
  page: 0,
  posts: [],
  isLoading: false,
  isRefreshing: false,
  filter: 'score',
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

const isLoading = (state = initialState.isLoading, action) => {
  switch (action.type) {
    case types.IS_LOADING_POSTS:
      return action.payload
    default:
      return state
  }
}

const isRefreshing = (state = initialState.isRefreshing, action) => {
  switch (action.type) {
    case types.IS_REFRESHING_POSTS:
      return action.payload
    default:
      return state
  }
}

const page = (state = initialState.page, action) => {
  switch (action.type) {
    case types.POSTS_NEXT_PAGE:
      return state + 1
    case types.RESET_POSTS_PAGE:
      return 0
    default:
      return state
  }
}

const filter = (state = initialState.filter, action) => {
  switch (action.type) {
    case types.UPDATE_POSTS_FILTER:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  page,
  posts,
  filter,
  isLoading,
  isRefreshing,
})
