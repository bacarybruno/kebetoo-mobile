import posts from 'Kebetoo/__fixtures__/posts'

export const BASE_URL = 'jest://localhost:1337'

export const getPostsCount = jest.fn().mockResolvedValue(0)
export const getReactionsCount = jest.fn().mockResolvedValue(0)
export const getCommentsCount = jest.fn().mockResolvedValue(0)
export const deletePost = jest.fn().mockResolvedValue(true)
export const getUserPosts = jest.fn().mockImplementation((userId) => (
  Object.values(posts).filter((post) => post.author === userId)
))
