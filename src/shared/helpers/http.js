/* eslint-disable no-undef */
const BASE_URL = 'http://localhost:1337'
const ITEMS_PER_PAGE = 20

const parseJSON = (res) => res.json()

const request = {
  get: (path = '') => fetch(`${BASE_URL}/${path}`).then(parseJSON),
  post: (path = '', body) => fetch(`${BASE_URL}/${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(parseJSON),
  put: (path = '', body) => fetch(`${BASE_URL}/${path}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(parseJSON),
  delete: (path = '') => fetch(`${BASE_URL}/${path}`, {
    method: 'DELETE',
  }).then(parseJSON),
}

export const getPosts = () => request.get(`posts?_limit=${ITEMS_PER_PAGE}`)

export const getUserPosts = (authorId) => request.get(
  `posts?author=${authorId}&_sort=updatedAt:desc`
)

export const getPost = (id) => request.get(`posts/${id}`)

export const getLatestsPosts = (page = 0) => request.get(
  `posts?_sort=updatedAt:desc&_start=${page * ITEMS_PER_PAGE}&_limit=${ITEMS_PER_PAGE}`,
)

export const createPost = ({ author, content }) => request.post('posts', { author, content })

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
