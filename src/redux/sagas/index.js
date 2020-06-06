import {
  takeLeading, call, put, all, select,
} from 'redux-saga/effects'

import * as api from 'Kebetoo/src/shared/helpers/http'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'

import normalizeData from '../misc/normalizer'
import * as types from '../types'
import { authorsSelector, reactionsSelector } from '../selectors'

function* fetchPosts(action) {
  try {
    const data = yield call(api.getLatestsPosts, action.payload)
    const normalizedData = yield call(normalizeData, data)

    const {
      posts, authors, comments, reactions,
    } = normalizedData.entities

    let postActionType = types.API_FETCH_POSTS_SUCCESS
    if (action.payload === 0) {
      postActionType = types.REPLACE_POSTS
    }

    if (authors) {
      const authorsIds = Object.keys(authors)
      yield put({ type: types.API_FETCH_AUTHORS, payload: authorsIds })
    }

    yield put({ type: postActionType, payload: posts || [] })
    yield put({ type: types.API_FETCH_REACTIONS_SUCCESS, payload: reactions || [] })
    yield put({ type: types.API_FETCH_COMMENTS_SUCCESS, payload: comments || [] })
  } catch (error) {
    yield put({ type: types.API_FETCH_POSTS_ERROR, error })
  }
}

function* fetchAuthors(action) {
  try {
    const authors = yield select(authorsSelector)
    const authorsToFetch = action.payload.filter((authorId) => !authors[authorId])
    if (authorsToFetch.length === 0) return
    const { docs } = yield call(getUsers, authorsToFetch)
    docs.forEach((doc) => {
      const { displayName: name, photoURL } = doc.data()
      authors[doc.id] = {
        displayName: name,
        photoURL,
        id: doc.id,
      }
    })
    yield put({ type: types.API_FETCH_AUTHORS_SUCCESS, payload: authors })
  } catch (error) {
    yield put({ type: types.API_FETCH_AUTHORS_ERROR, error })
  }
}

function* handlePostReaction(action) {
  try {
    const { postId, author, type } = action.payload
    const reactions = yield select(reactionsSelector)

    const userReaction = Object.values(reactions).find((reaction) => (
      reaction.author === author && reaction.post === postId
    ))

    if (userReaction === undefined) {
      const result = yield call(api.createReaction, type, postId, author)
      yield put({
        type: types.API_CREATE_REACTION_SUCCESS,
        payload: result,
      })
    } else if (userReaction.type === type) {
      yield call(api.deleteReaction, userReaction.id)
      yield put({
        type: types.API_DELETE_REACTION_SUCCESS,
        payload: {
          reaction: userReaction.id,
          post: postId,
        },
      })
    } else {
      yield call(api.editReaction, userReaction.id, type)
      yield put({
        type: types.API_EDIT_REACTION_SUCCESS,
        payload: { id: userReaction.id, type },
      })
    }
  } catch (error) {
    yield put({ type: types.API_REACT_POST_ERROR, error })
  }
}

export default function* root() {
  yield all([
    yield takeLeading(types.API_FETCH_POSTS, fetchPosts),
    yield takeLeading(types.API_FETCH_AUTHORS, fetchAuthors),
    yield takeLeading(types.API_REACT_POST, handlePostReaction),
  ])
}
