import {
  takeLeading, call, put, all, select,
} from 'redux-saga/effects'

import {
  api,
  getFacebookPicture,
  createOrUpdateUser,
  getNotificationToken,
} from '@app/shared/services'

import channels from './channels'
import * as types from '../types'
import {
  blockedItemsSelector,
  userProfileSelector,
  postsFilterSelector,
  postsPageSelector,
} from '../selectors'

function* fetchPosts(action) {
  try {
    const posts = yield call([api.posts, 'get'], action.payload)
    const blockedItems = yield select(blockedItemsSelector)
    // allow only posts that are not blocked by user
    // and those on which author is not blocked
    let allowedPosts = posts
    allowedPosts = posts.filter((post) => (
      !blockedItems.posts.includes(post.id)
      && !blockedItems.authors.includes(post.author?.id)
    ))

    yield put({
      type: action.payload.page === 0
        ? types.REPLACE_POSTS
        : types.API_FETCH_POSTS_SUCCESS,
      payload: allowedPosts || [],
    })
  } catch (error) {
    yield put({ type: types.API_FETCH_POSTS_ERROR, payload: error })
  } finally {
    yield put({ type: types.IS_LOADING_POSTS, payload: false })
    yield put({ type: types.IS_REFRESHING_POSTS, payload: false })
  }
}

function* setUserProfile(action) {
  try {
    if (!action.payload.isLoggedIn) {
      // handle signout
      yield put({ type: types.SET_USER_PROFILE, payload: action.payload })
      yield put({ type: types.LOGOUT })
      return
    }

    // returned from auth channel
    const {
      uid,
      email,
      provider,
      isLoggedIn,
      providerUid,
      displayName,
    } = action.payload

    // get photo URL
    let { photoURL } = action.payload
    if (provider.startsWith('facebook')) {
      photoURL = getFacebookPicture(providerUid)
    }

    const profile = yield select(userProfileSelector)
    if (profile.displayName === displayName
      && profile.email === email
      && profile.photoURL === photoURL) {
      // nothing changed
      return
    }

    // sign user in and save basic infos from auth event
    yield put({
      type: types.SET_USER_PROFILE,
      payload: {
        isLoggedIn, email, displayName, photoURL,
      },
    })

    // create author in the backend
    const { id: authorId, username, bio } = yield call(createOrUpdateUser, {
      id: uid, displayName, photoURL,
    })

    // save additional infos in redux
    yield put({
      type: types.SET_USER_PROFILE,
      payload: {
        uid: authorId, username, bio,
      },
    })

    // fetch notification token
    const notificationToken = yield call(getNotificationToken)
    if (notificationToken) {
      yield call([api.authors, 'update'], authorId, { notificationToken })
    }

    // save token in the backend
  } catch (error) {
    yield put({ type: types.SET_USER_PROFILE_ERROR, payload: error })
  }
}

function* fetchPostsNextPage() {
  yield put({ type: types.IS_LOADING_POSTS, payload: true })
  yield put({ type: types.POSTS_NEXT_PAGE })
  const filter = yield select(postsFilterSelector)
  const page = yield select(postsPageSelector)
  yield put({ type: types.API_FETCH_POSTS, payload: { page, filter } })
}

function* updatePostsFilter(action) {
  const { filter, shouldRefresh = true } = action.payload
  yield put({ type: types.IS_REFRESHING_POSTS, payload: shouldRefresh })
  yield put({ type: types.RESET_POSTS_PAGE })
  yield put({ type: types.UPDATE_POSTS_FILTER, payload: filter })
  const page = yield select(postsPageSelector)
  yield put({ type: types.API_FETCH_POSTS, payload: { page, filter } })
}

function* initPosts() {
  const filter = yield select(postsFilterSelector)
  yield put({
    type: types.UPDATE_POSTS_FILTER_REQUEST,
    payload: {
      filter,
      shouldRefresh: false,
    },
  })
}

export default function* root() {
  yield all([
    yield takeLeading(types.API_FETCH_POSTS, fetchPosts),
    yield takeLeading(types.SET_USER_PROFILE_REQUEST, setUserProfile),
    yield takeLeading(types.POSTS_NEXT_PAGE_REQUEST, fetchPostsNextPage),
    yield takeLeading(types.UPDATE_POSTS_FILTER_REQUEST, updatePostsFilter),
    yield takeLeading(types.INIT_POSTS, initPosts),
    yield call(channels),
  ])
}
