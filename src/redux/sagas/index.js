import {
  takeLeading, call, put, all, select, debounce,
} from 'redux-saga/effects'

import * as api from '@app/shared/services/http'
import helpers from '@app/shared/components/emoji-selector/helpers'

import * as types from '../types'
import { emojiHistorySelector } from '../selectors'

function* fetchPosts(action) {
  try {
    const data = yield call(api.getLatestsPosts, action.payload)

    let postActionType = types.API_FETCH_POSTS_SUCCESS
    if (action.payload === 0) {
      postActionType = types.REPLACE_POSTS
    }

    yield put({ type: postActionType, payload: data || [] })
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

export default function* root() {
  yield all([
    yield takeLeading(types.API_FETCH_POSTS, fetchPosts),
    yield debounce(3000, types.ADD_EMOJI_HISTORY, addEmojiHistory),
  ])
}
