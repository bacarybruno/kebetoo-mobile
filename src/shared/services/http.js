/* eslint-disable no-undef */
import RNFetchBlob from 'rn-fetch-blob'

import { env } from '@app/config'

const ITEMS_PER_PAGE = 20

const parseJSON = (res) => res.json()

const getApiUrl = (path) => `${env.apiBaseUrl}/${path}`

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const request = {
  get: (path = '') => fetch(getApiUrl(path)).then(parseJSON),

  post: (path = '', body) => fetch(getApiUrl(path), {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(body),
  }).then(parseJSON),

  put: (path = '', body) => fetch(getApiUrl(path), {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(body),
  }).then(parseJSON),

  delete: (path = '') => fetch(getApiUrl(path), {
    method: 'DELETE',
    headers: jsonHeaders,
  }).then(parseJSON),

  postFormData: (path = '', formdata) => RNFetchBlob.fetch('POST', getApiUrl(path), {
    'Content-Type': 'multipart/form-data',
  }, formdata).then(parseJSON),
}

export const getUserPosts = (authorId) => request.get(
  `posts?author.id=${authorId}&_sort=updatedAt:desc`,
)

export const getPost = (id) => request.get(`posts/${id}`)

export const getComments = (postId) => request.get(`comments?post.id=${postId}`)

export const getReplies = (commentId) => request.get(`comments?thread=${commentId}&_sort=createdAt`)

export const getLatestsPosts = (page = 0) => request.get(
  `posts?_sort=score:desc&_start=${page * ITEMS_PER_PAGE}&_limit=${ITEMS_PER_PAGE}`,
)

export const createPost = async ({ author, content, repost }) => request.post('posts', { author, content, repost })
export const createPostWithAudio = async ({
  audio, content, repost, author,
}) => {
  const postData = {
    name: 'data',
    data: JSON.stringify({ content, author, repost }),
  }
  const audioData = {
    name: 'files.audio',
    filename: audio.name,
    type: audio.mimeType,
    data: RNFetchBlob.wrap(audio.uri),
  }
  return request.postFormData('posts', [postData, audioData])
}
export const createPostWithImage = async ({
  image, content, repost, author,
}) => {
  const postData = {
    name: 'data',
    data: JSON.stringify({ content, author, repost }),
  }
  const imageData = {
    name: 'files.image',
    filename: image.name,
    type: image.mimeType,
    data: RNFetchBlob.wrap(image.uri),
  }
  return request.postFormData('posts', [postData, imageData])
}

export const editPost = ({ id, content }) => request.put(`posts/${id}`, { content })

export const deletePost = (id) => request.delete(`posts/${id}`)

export const commentPost = ({
  author, post, content, thread,
}) => (
  request.post('comments', {
    author, post, content, thread,
  })
)

export const commentPostWithAudio = ({
  author, audio, post, thread,
}) => {
  const commentData = {
    name: 'data',
    data: JSON.stringify({ author, post, thread }),
  }
  const audioData = {
    name: 'files.audio',
    filename: audio.name,
    type: audio.mimeType,
    data: RNFetchBlob.wrap(audio.uri),
  }
  return request.postFormData('comments', [commentData, audioData])
}
export const deleteComment = (id) => request.delete(`comments/${id}`)

export const createReaction = (type, post, author) => (
  request.post('reactions/', { type, post, author })
)
export const createCommentReaction = (type, comment, author) => (
  request.post('reactions/', { type, comment, author })
)
export const editReaction = (id, type) => request.put(`reactions/${id}`, { type })
export const deleteReaction = (id) => request.delete(`reactions/${id}`)

export const getPostsCount = (author) => request.get(`posts/count?author.id=${author}`)
export const getReactionsCount = (author) => request.get(`reactions/count?post.author=${author}`)
export const getCommentsCount = (author) => request.get(`comments/count?post.author=${author}`)

export const searchPosts = (searchQuery) => request.get(`posts?content_contains=${searchQuery}&_limit=30`)
export const searchUsers = (searchQuery) => request.get(`authors?displayName_contains=${searchQuery}&_limit=30`)

export const createAuthor = ({ id, displayName, photoURL }) => request.post('authors', { uid: id, displayName, photoURL })
export const getAuthorByUid = (uid) => request.get(`authors?uid=${uid}`)
export const getAuthorById = (id) => request.get(`authors/${id}`)
export const updateAuthor = (id, data) => request.put(`authors/${id}`, data)
export const getAuthors = (ids) => {
  const queryString = ids.map((id) => `id_eq=${id}`).join('&')
  return request.get(`authors?${queryString}`)
}
