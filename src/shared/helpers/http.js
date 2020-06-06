/* eslint-disable no-undef */
import RNFetchBlob from 'rn-fetch-blob'

export const BASE_URL = 'http://localhost:1337'
const ITEMS_PER_PAGE = 20

const parseJSON = (res) => res.json()

const getApiUrl = (path) => `${BASE_URL}/${path}`

const request = {
  get: (path = '') => fetch(getApiUrl(path)).then(parseJSON),

  post: (path = '', body) => fetch(getApiUrl(path), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(parseJSON),

  put: (path = '', body) => fetch(getApiUrl(path), {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(parseJSON),

  delete: (path = '') => fetch(getApiUrl(path), {
    method: 'DELETE',
  }).then(parseJSON),

  postFormData: (path = '', formdata) => RNFetchBlob.fetch('POST', getApiUrl(path), {
    'Content-Type': 'multipart/form-data',
  }, formdata).then(parseJSON),
}

export const getPosts = () => request.get(`posts?_limit=${ITEMS_PER_PAGE}`)

export const getUserPosts = (authorId) => request.get(
  `posts?author=${authorId}&_sort=updatedAt:desc`,
)

export const getPost = (id) => request.get(`posts/${id}`)

export const getComments = (postId) => request.get(`comments?post.id=${postId}`)

export const getLatestsPosts = (page = 0) => request.get(
  `posts?_sort=updatedAt:desc&_start=${page * ITEMS_PER_PAGE}&_limit=${ITEMS_PER_PAGE}`,
)

export const createPost = ({ author, content }) => request.post('posts', { author, content })
export const createPostWithAudio = ({ author, audio, content }) => {
  const postData = {
    name: 'data',
    data: JSON.stringify({ content, author }),
  }
  const audioData = {
    name: 'files.audio',
    filename: audio.name,
    type: audio.mimeType,
    data: RNFetchBlob.wrap(audio.uri),
  }
  return request.postFormData('posts', [postData, audioData])
}
export const createPostWithImage = ({ author, image, content }) => {
  const postData = {
    name: 'data',
    data: JSON.stringify({ content, author }),
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

export const commentPost = ({ author, post, content }) => request.post(
  'comments',
  { author, post, content },
)
export const commentPostWithAudio = ({ author, audio, post }) => {
  const commentData = {
    name: 'data',
    data: JSON.stringify({ author, post }),
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

export const getPostsCount = (author) => request.get(`posts/count?author=${author}`)
export const getReactionsCount = (author) => request.get(`reactions/count?post.author=${author}`)
export const getCommentsCount = (author) => request.get(`comments/count?post.author=${author}`)
