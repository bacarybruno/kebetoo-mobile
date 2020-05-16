/* eslint-disable no-undef */
import RNFetchBlob from 'rn-fetch-blob'

const BASE_URL = 'http://localhost:1337'
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
    type: 'audio/aac',
    data: RNFetchBlob.wrap(audio.uri),
  }
  return request.postFormData('posts', [postData, audioData])
}

export const editPost = ({ id, content }) => request.put(`posts/${id}`, { content })

export const deletePost = (id) => request.delete(`posts/${id}`)

export const commentPost = ({ author, post, content }) => request.post(
  'comments',
  { author, post, content },
)
export const deleteComment = (id) => request.delete(`comments/${id}`)

export const likePost = ({ author, post }) => request.post('likes', { author, post })
export const deleteLike = (id) => request.delete(`likes/${id}`)

export const dislikePost = ({ author, post }) => request.post('dislikes', { author, post })
export const deleteDislike = (id) => request.delete(`dislikes/${id}`)

export const getPostsCount = (author) => request.get(`posts/count?author=${author}`)
export const getLikesCount = (author) => request.get(`likes/count?post.author=${author}`)
export const getDislikesCount = (author) => request.get(`dislikes/count?post.author=${author}`)
export const getCommentsCount = (author) => request.get(`comments/count?post.author=${author}`)
