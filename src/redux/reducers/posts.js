/* eslint-disable no-case-declarations */

import { combineReducers } from 'redux'

import * as types from '../types'

const initialState = {
  posts: [],
  authors: {},
  comments: [],
  likes: {},
  dislikes: {},
}

const posts = (state = initialState.posts, action) => {
  switch (action.type) {
    case types.API_FETCH_POSTS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    case types.REPLACE_POSTS:
      return action.payload
    case types.LIKE_SUCCESS:
      return {
        ...state,
        [action.payload.postId]: {
          ...state[action.payload.postId],
          likes: [
            ...state[action.payload.postId].likes,
            action.payload.like.id,
          ],
        },
      }
    case types.DELETE_LIKE_SUCCESS:
      return {
        ...state,
        [action.payload.postId]: {
          ...state[action.payload.postId],
          likes: [
            ...state[action.payload.postId]
              .likes.filter((like) => like !== action.payload.likeId),
          ],
        },
      }
    case types.DISLIKE_SUCCESS:
      return {
        ...state,
        [action.payload.postId]: {
          ...state[action.payload.postId],
          dislikes: [
            ...state[action.payload.postId].dislikes,
            action.payload.dislike.id,
          ],
        },
      }
    case types.DELETE_DISLIKE_SUCCESS:
      return {
        ...state,
        [action.payload.postId]: {
          ...state[action.payload.postId],
          dislikes: [
            ...state[action.payload.postId]
              .dislikes.filter((dislike) => dislike !== action.payload.dislikeId),
          ],
        },
      }
    default:
      return state
  }
}

const likes = (state = initialState.likes, action) => {
  switch (action.type) {
    case types.REPLACE_POSTS:
      return []
    case types.API_FETCH_LIKES_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    case types.LIKE_SUCCESS:
      return {
        ...state,
        [action.payload.like.id]: {
          ...action.payload.like,
          post: action.payload.postId,
        },
      }
    case types.DELETE_LIKE_SUCCESS:
      return {
        ...state,
        [action.payload.likeId]: undefined,
      }
    default:
      return state
  }
}

const dislikes = (state = initialState.dislikes, action) => {
  switch (action.type) {
    case types.REPLACE_POSTS:
      return []
    case types.API_FETCH_DISLIKES_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    case types.DISLIKE_SUCCESS:
      return {
        ...state,
        [action.payload.dislike.id]: {
          ...action.payload.dislike,
          post: action.payload.postId,
        },
      }
    case types.DELETE_DISLIKE_SUCCESS:
      return {
        ...state,
        [action.payload.dislikeId]: undefined,
      }
    default:
      return state
  }
}

const comments = (state = initialState.comments, action) => {
  switch (action.type) {
    case types.REPLACE_POSTS:
      return []
    case types.API_FETCH_COMMENTS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

const authors = (state = initialState.authors, action) => {
  switch (action.type) {
    case types.API_FETCH_AUTHORS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export default combineReducers({
  posts,
  likes,
  dislikes,
  comments,
  authors,
})
