import { schema } from 'normalizr'

export const author = new schema.Entity('authors')

export const reaction = new schema.Entity('reactions')

const post = new schema.Entity('posts', {
  author,
  reactions: [reaction],
  repost: {
    author,
  },
})

const posts = new schema.Array(post)

export default posts
