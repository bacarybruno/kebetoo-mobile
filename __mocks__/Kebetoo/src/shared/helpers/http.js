import posts from 'Kebetoo/__fixtures__/posts'
import comments from 'Kebetoo/__fixtures__/comments'

export const BASE_URL = 'jest://localhost:1337'

export const getPostsCount = jest.fn().mockResolvedValue(0)
export const getReactionsCount = jest.fn().mockResolvedValue(0)
export const getCommentsCount = jest.fn().mockResolvedValue(0)
export const deletePost = jest.fn().mockResolvedValue(true)
export const commentPost = jest.fn().mockImplementation((data) => Promise.resolve({
  author: data.author,
  content: data.content,
  post: {
    id: data.post,
  },
  reactions: [],
  id: parseInt(Math.random() * 10000000).toString(),
}))
export const getUserPosts = jest.fn().mockImplementation((userId) => Promise.resolve(
  Object.values(posts).filter((post) => post.author === userId),
))
export const getComments = jest.fn().mockImplementation((postId) => Promise.resolve(
  Object.values(comments).filter((comment) => comment.post.id === postId),
))
