import {
  takeLeading, call, put, all, select,
} from 'redux-saga/effects'

import * as api from 'Kebetoo/src/shared/helpers/http'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'

import normalizeData from '../misc/normalizer'
import * as types from '../types'
import { authorsSelector } from '../selectors'

function* fetchPosts(action) {
  try {
    const data = yield call(api.getLatestsPosts, action.payload)
    const normalizedData = yield call(normalizeData, data)

    const { posts, authors } = normalizedData.entities

    let postActionType = types.API_FETCH_POSTS_SUCCESS
    if (action.payload === 0) {
      postActionType = types.REPLACE_POSTS
    }

    if (authors) {
      const authorsIds = Object.keys(authors)
      yield put({ type: types.API_FETCH_AUTHORS, payload: authorsIds })
    }

    yield put({ type: postActionType, payload: posts || [] })
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

export default function* root() {
  yield all([
    yield takeLeading(types.API_FETCH_POSTS, fetchPosts),
    yield takeLeading(types.API_FETCH_AUTHORS, fetchAuthors),
  ])
}
