import {
  takeLeading, call, put, all, select, debounce,
} from 'redux-saga/effects'

import helpers from '@app/shared/components/emoji-selector/helpers'
import {
  api,
  getFacebookPicture,
  createOrUpdateUser,
  getNotificationToken,
} from '@app/shared/services'

import channels from './channels'
import * as types from '../types'
import { blockedItemsSelector, emojiHistorySelector, userProfileSelector } from '../selectors'

function* fetchPosts(action) {
  try {
    const posts = yield call([api.posts, 'get'], action.payload)

    let postActionType = types.API_FETCH_POSTS_SUCCESS
    if (action.payload.page === 0) {
      postActionType = types.REPLACE_POSTS
    }

    const blockedItems = yield select(blockedItemsSelector)

    // allow only posts that are not blocked by user
    // and those on which author is not blocked
    let allowedPosts = posts
    allowedPosts = posts.filter((post) => (
      !blockedItems.posts.includes(post.id)
      && !blockedItems.authors.includes(post.author?.id)
    ))

    yield put({ type: postActionType, payload: allowedPosts || [] })
  } catch (error) {
    yield put({ type: types.API_FETCH_POSTS_ERROR, payload: error })
  }
}

const sortHistoryItems = (items) => items.sort((a, b) => {
  const count = b.count - a.count
  const addedOn = b.addedOn - a.addedOn
  return count || addedOn
})

function* addEmojiHistory(action) {
  try {
    const item = action.payload
    const historyItemsState = yield select(emojiHistorySelector)
    const historyItems = historyItemsState || []
    let newHistoryItems = []
    const foundHistoryItem = historyItems.find((historyItem) => historyItem.symbol === item)
    if (foundHistoryItem) {
      foundHistoryItem.count += 1
      newHistoryItems = [
        ...historyItems.filter((historyItem) => historyItem.symbol !== item),
        foundHistoryItem,
      ]
    } else {
      newHistoryItems = [...historyItems]
      if (newHistoryItems.length >= helpers.history.maxItems) {
        const removed = newHistoryItems.pop()
        console.log('Removed history item', removed)
      }
      const newHistoryItem = { count: 1, symbol: item, addedOn: Date.now() }
      newHistoryItems = [...newHistoryItems, newHistoryItem]
    }
    yield put({ type: types.SET_EMOJI_HISTORY, payload: sortHistoryItems(newHistoryItems) })
  } catch (error) {
    yield put({ type: types.ADD_EMOJI_HISTORY_ERROR, payload: error })
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

    // create author in the backend
    const authorId = yield call(createOrUpdateUser, {
      id: uid, displayName, photoURL,
    })

    // save infos in redux
    yield put({
      type: types.SET_USER_PROFILE,
      payload: {
        uid: authorId, email, photoURL, isLoggedIn, displayName,
      },
    })

    // fetch notification token
    const notificationToken = yield call(getNotificationToken)
    if (notificationToken) {
      yield call([api.authors, 'update'], authorId, { notificationToken })
    }

    // save token in the backend
  } catch (error) {
    console.log({ type: types.SET_USER_PROFILE_ERROR, payload: error })
    yield put({ type: types.SET_USER_PROFILE_ERROR, payload: error })
  }
}

export default function* root() {
  yield all([
    yield takeLeading(types.API_FETCH_POSTS, fetchPosts),
    yield debounce(3000, types.ADD_EMOJI_HISTORY, addEmojiHistory),
    yield takeLeading(types.SET_USER_PROFILE_REQUEST, setUserProfile),
    yield call(channels),
  ])
}
