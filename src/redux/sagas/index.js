import {
  takeLeading, call, put, all,
} from 'redux-saga/effects'

import * as api from 'Kebetoo/src/shared/helpers/http'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import { hasDisliked, hasLiked } from 'Kebetoo/src/packages/post/containers/basic-post'

import * as types from '../types'

function* fetchPosts(action) {
  try {
    const posts = yield call(api.getLatestsPosts, action.payload)
    const authorsIds = [...new Set(posts.map((post) => post.author))]
    if (action.payload === 0) {
      yield put({ type: types.CLEAR_POSTS })
    }
    yield put({ type: types.API_FETCH_POSTS_SUCCESS, payload: posts })
    yield put({ type: types.API_FETCH_AUTHORS, payload: authorsIds })
  } catch (error) {
    yield put({ type: types.API_FETCH_POSTS_ERROR, error })
  }
}

function* refreshPosts() {
  yield put({ type: types.API_REFRESH_POSTS_PENDING })
  yield put({ type: types.API_FETCH_POSTS, payload: 0 })
  yield put({ type: types.API_REFRESH_POSTS_SUCCESS })
}

function* fetchAuthors(action) {
  try {
    const { docs } = yield call(getUsers, action.payload)
    const authors = {}
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

function* toggleLikePost(action) {
  const { post, author } = action.payload
  if (hasLiked({ post, author })) {
    const { id } = post.likes.find((like) => like.author === author.id)
    yield call(api.deleteLike, id)
  } else {
    if (hasDisliked({ post, author })) {
      const { id } = post.dislikes.find((dislike) => dislike.author === author.id)
      yield call(api.deleteDislike, id)
    }
    yield call(api.likePost, ({ post: post.id, author: author.id }))
  }
  const updatedPost = yield call(api.getPost, post.id)
  yield put({ type: types.REPLACE_POST, payload: updatedPost })
}

function* toggleDislikePost(action) {
  const { post, author } = action.payload
  if (hasDisliked({ post, author })) {
    const { id } = post.dislikes.find((dislike) => dislike.author === author.id)
    yield call(api.deleteDislike, id)
  } else {
    if (hasLiked({ post, author })) {
      const { id } = post.likes.find((like) => like.author === author.id)
      yield call(api.deleteLike, id)
    }
    yield call(api.dislikePost, { post: post.id, author: author.id })
  }
  const updatedPost = yield call(api.getPost, post.id)
  yield put({ type: types.REPLACE_POST, payload: updatedPost })
}

export default function* root() {
  yield all([
    yield takeLeading(types.API_FETCH_POSTS, fetchPosts),
    yield takeLeading(types.API_FETCH_AUTHORS, fetchAuthors),
    yield takeLeading(types.API_REFRESH_POSTS, refreshPosts),
    yield takeLeading(types.API_TOGGLE_LIKE_POST, toggleLikePost),
    yield takeLeading(types.API_TOGGLE_DISLIKE_POST, toggleDislikePost),
  ])
}
