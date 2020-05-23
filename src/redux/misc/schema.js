import { schema } from 'normalizr'

export const author = new schema.Entity('authors')

export const reaction = new schema.Entity('reactions')

export const comment = new schema.Entity('comments')

const post = new schema.Entity('posts', {
  author,
  reactions: [reaction],
  comments: [comment],
})

const posts = new schema.Array(post)

export default posts
