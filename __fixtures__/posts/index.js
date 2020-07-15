import audio from './audio.json'
import image from './image.json'
import text from './text.json'
import repost from './repost.json'

const posts = {
  audio,
  image,
  text,
  repost,
}

export const postsList = Object.values(posts)
export default posts
