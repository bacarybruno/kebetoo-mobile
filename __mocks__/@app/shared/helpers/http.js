import { postsList } from '@fixtures/posts'
import authors from '@fixtures/authors'
import comments from '@fixtures/comments'

// eslint-disable-next-line radix
const createRandomId = () => parseInt(Math.random() * 10000000).toString()

export const BASE_URL = 'jest://localhost:1337'

export const getPostsCount = jest.fn().mockResolvedValue(0)
export const getPost = jest.fn().mockImplementation((postId) => Promise.resolve(
  postsList.find((post) => post.id === postId),
))
export const searchPosts = jest.fn().mockImplementation((query) => Promise.resolve((
  postsList.filter((post) => post.content?.toLowerCase().includes(query.toLowerCase()))
)))
export const getReactionsCount = jest.fn().mockResolvedValue(0)
export const getCommentsCount = jest.fn().mockResolvedValue(0)
export const deletePost = jest.fn().mockResolvedValue(true)
export const deleteReaction = jest.fn().mockResolvedValue(true)
export const editReaction = jest.fn().mockResolvedValue(true)
export const getUsers = jest.fn().mockResolvedValue(authors)
export const updateAuthor = jest.fn().mockResolvedValue(true)
export const getAuthorByUid = jest.fn()
  .mockImplementation((uid) => authors.filter((author) => author.uid === uid))
export const commentPost = jest.fn().mockImplementation((data) => Promise.resolve({
  author: {
    id: data.author,
    displayName: ' ',
    photoURL: null,
  },
  content: data.content,
  post: {
    id: data.post,
  },
  reactions: [],
  id: createRandomId(),
}))
export const getUserPosts = jest.fn().mockImplementation((userId) => Promise.resolve(
  postsList.filter((post) => post.author.id === userId),
))
export const getComments = jest.fn().mockImplementation((postId) => Promise.resolve(
  comments.filter((comment) => comment.post.id === postId),
))
export const createReaction = jest.fn().mockImplementation(
  (type, postId, author) => (
    Promise.resolve({
      id: createRandomId(),
      type,
      author: {
        id: author,
      },
      post: { id: postId },
    })
  ),
)
export const createCommentReaction = jest.fn().mockImplementation(
  (type, commentId, author) => (
    Promise.resolve({
      id: createRandomId(),
      type,
      author: {
        id: author,
      },
      comment: { id: commentId },
    })
  ),
)

export const getAuthorById = jest.fn()

