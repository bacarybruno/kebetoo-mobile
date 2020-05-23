import { combineReducers } from 'redux'

import { deleteProperty, mergeObjects, mergeArrays } from 'Kebetoo/src/shared/helpers/object'

import * as types from '../types'

const initialState = {
  posts: [],
  authors: {},
  reactions: {},
  comments: {},
}

const posts = (state = initialState.posts, action) => {
  switch (action.type) {
    case types.API_FETCH_POSTS_SUCCESS:
      return mergeObjects(state, action.payload)
    case types.REPLACE_POSTS:
      return action.payload
    case types.API_DELETE_REACTION_SUCCESS:
      return mergeObjects(state, {
        [action.payload.post]: mergeObjects(state[action.payload.post], {
          reactions: state[action.payload.post]
            .reactions
            .filter((reactionId) => reactionId !== action.payload.reaction),
        }),
      })
    case types.API_CREATE_REACTION_SUCCESS:
      return mergeObjects(state, {
        [action.payload.post.id]: mergeObjects(state[action.payload.post.id], {
          reactions: mergeArrays(
            state[action.payload.post.id].reactions,
            action.payload.id,
          ),
        }),
      })
    case types.COMMENT_POST_SUCCESS:
      return mergeObjects(state, {
        [action.payload.post.id]: mergeObjects(state[action.payload.post.id], {
          comments: mergeArrays(
            state[action.payload.post.id].comments,
            action.payload.id,
          ),
        }),
      })
    default:
      return state
  }
}

const reactions = (state = initialState.reactions, action) => {
  switch (action.type) {
    case types.REPLACE_POSTS:
      return {}
    case types.API_FETCH_REACTIONS_SUCCESS:
      return mergeObjects(state, action.payload)
    case types.API_DELETE_REACTION_SUCCESS:
      return deleteProperty(state, action.payload.reaction)
    case types.API_CREATE_REACTION_SUCCESS:
      return mergeObjects(state, {
        [action.payload.id]: mergeObjects(action.payload, {
          post: action.payload.post.id,
        }),
      })
    case types.API_EDIT_REACTION_SUCCESS:
      return mergeObjects(state, {
        [action.payload.id]: mergeObjects(state[action.payload.id], {
          type: action.payload.type,
        }),
      })
    default:
      return state
  }
}

const comments = (state = initialState.comments, action) => {
  switch (action.type) {
    case types.REPLACE_POSTS:
      return []
    case types.API_FETCH_COMMENTS_SUCCESS:
      return mergeObjects(state, action.payload)
    case types.COMMENT_POST_SUCCESS:
      return mergeObjects(state, {
        [action.payload.id]: mergeObjects(action.payload, {
          post: action.payload.post.id,
        }),
      })
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
  comments,
  reactions,
})
