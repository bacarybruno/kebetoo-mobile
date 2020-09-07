import {
  takeLeading, call, put, all,
} from 'redux-saga/effects'

import * as api from '@app/shared/helpers/http'

import * as types from '../types'

function* fetchPosts(action) {
  try {
    const data = yield call(api.getLatestsPosts, action.payload)

    let postActionType = types.API_FETCH_POSTS_SUCCESS
    if (action.payload === 0) {
      postActionType = types.REPLACE_POSTS
    }

    yield put({ type: postActionType, payload: data || [] })
  } catch (error) {
    yield put({ type: types.API_FETCH_POSTS_ERROR, error })
  }
}

export default function* root() {
  yield all([
    yield takeLeading(types.API_FETCH_POSTS, fetchPosts),
  ])
}
