import {
  takeLeading, call, put, all, select, fork,
} from 'redux-saga/effects'

import * as api from 'Kebetoo/src/shared/helpers/http'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import {
  hasDisliked, hasLiked, findLiked, findDisliked,
} from 'Kebetoo/src/packages/post/containers/reactions'

import normalizeData from '../misc/normalizer'
import * as types from '../types'
import {
  authorsSelector, likesSelector, dislikesSelector, postsSelector,
} from '../selectors'

function* fetchPosts(action) {
  try {
    const data = yield call(api.getLatestsPosts, action.payload)
    const normalizedData = yield call(normalizeData, data)

    const {
      posts, authors, comments, likes, dislikes,
    } = normalizedData.entities

    let postActionType = types.API_FETCH_POSTS_SUCCESS
    if (action.payload === 0) {
      postActionType = types.REPLACE_POSTS
    }

    const authorsIds = Object.keys(authors)

    yield put({ type: types.API_FETCH_AUTHORS, payload: authorsIds })
    yield put({ type: postActionType, payload: posts })
    yield put({ type: types.API_FETCH_COMMENTS_SUCCESS, payload: comments })
    yield put({ type: types.API_FETCH_LIKES_SUCCESS, payload: likes })
    yield put({ type: types.API_FETCH_DISLIKES_SUCCESS, payload: dislikes })
  } catch (error) {
    yield put({ type: types.API_FETCH_POSTS_ERROR, error })
  }
}

function* deleteLike(likes, post, author) {
  const id = yield call(findLiked, { likes, post, author })
  yield call(api.deleteLike, id)
  yield put({
    type: types.DELETE_LIKE_SUCCESS,
    payload: { likeId: id, postId: post.id },
  })
}

function* deleteDisLike(dislikes, post, author) {
  const id = yield call(findDisliked, { dislikes, post, author })
  yield call(api.deleteDislike, id)
  yield put({
    type: types.DELETE_DISLIKE_SUCCESS,
    payload: { dislikeId: id, postId: post.id },
  })
}

function* createLike(post, author) {
  const like = yield call(api.likePost, { post: post.id, author })
  yield put({
    type: types.LIKE_SUCCESS,
    payload: { postId: post.id, like },
  })
}

function* createDislike(post, author) {
  const dislike = yield call(api.dislikePost, { post: post.id, author })
  yield put({
    type: types.DISLIKE_SUCCESS,
    payload: { postId: post.id, dislike },
  })
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

function* toggleLikePost(action) {
  try {
    const { postId, author } = action.payload

    const likes = yield select(likesSelector)
    const dislikes = yield select(dislikesSelector)
    const posts = yield select(postsSelector)
    const post = posts[postId]

    const liked = hasLiked({ likes, post, author })
    const disliked = hasDisliked({ dislikes, post, author })

    if (liked) {
      yield fork(deleteLike, likes, post, author)
    } else {
      if (disliked) {
        yield fork(deleteDisLike, dislikes, post, author)
      }
      yield fork(createLike, post, author)
    }
  } catch (error) {
    yield put({ type: types.API_TOGGLE_LIKE_DISLIKE_ERROR, error })
  }
}

function* toggleDislikePost(action) {
  try {
    const { postId, author } = action.payload
    const likes = yield select(likesSelector)
    const dislikes = yield select(dislikesSelector)
    const posts = yield select(postsSelector)
    const post = posts[postId]

    const liked = hasLiked({ likes, post, author })
    const disliked = hasDisliked({ dislikes, post, author })

    if (disliked) {
      yield fork(deleteDisLike, dislikes, post, author)
    } else {
      if (liked) {
        yield fork(deleteLike, likes, post, author)
      }
      yield fork(createDislike, post, author)
    }
  } catch (error) {
    yield put({ type: types.API_TOGGLE_LIKE_DISLIKE_ERROR, error })
  }
}

function* commentPost(action) {
  try {
    const { author, post, content } = action.payload
    const result = yield call(api.commentPost, { author, post, content })
    yield put({ type: types.COMMENT_POST_SUCCESS, payload: result })
  } catch (error) {
    yield put({ type: types.COMMENT_POST_ERROR, error })
  }
}

export default function* root() {
  yield all([
    yield takeLeading(types.API_FETCH_POSTS, fetchPosts),
    yield takeLeading(types.API_FETCH_AUTHORS, fetchAuthors),
    yield takeLeading(types.API_TOGGLE_LIKE_POST, toggleLikePost),
    yield takeLeading(types.API_TOGGLE_DISLIKE_POST, toggleDislikePost),
    yield takeLeading(types.COMMENT_POST, commentPost),
  ])
}
