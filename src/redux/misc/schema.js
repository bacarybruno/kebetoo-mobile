import { schema } from 'normalizr'

export const author = new schema.Entity('authors')

export const comment = new schema.Entity('comments')

export const like = new schema.Entity('likes')

export const dislike = new schema.Entity('dislikes')

const post = new schema.Entity('posts', {
  author,
  likes: [like],
  dislikes: [dislike],
  comments: [comment],
})

const posts = new schema.Array(post)

export default posts
