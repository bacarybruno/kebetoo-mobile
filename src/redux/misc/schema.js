import { schema } from 'normalizr'

export const author = new schema.Entity('authors')

const post = new schema.Entity('posts', {
  author,
  repost: {
    author,
  },
})

const posts = new schema.Array(post)

export default posts
