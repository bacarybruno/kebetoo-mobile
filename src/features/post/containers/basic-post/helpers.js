export const POST_TYPES = {
  AUDIO: 'audio',
  IMAGE: 'image',
  TEXT: 'text',
  REPOST: 'repost',
  VIDEO: 'video',
};

export const getPostType = (post) => {
  if (post.repost) {
    return POST_TYPES.REPOST;
  }
  if (post.audio && post.audio.url) {
    return POST_TYPES.AUDIO;
  }
  if (post.image && post.image.url) {
    return POST_TYPES.IMAGE;
  }
  if (post.video && post.video.url) {
    return POST_TYPES.VIDEO;
  }
  if (post.content && post.content.length > 0) {
    return POST_TYPES.TEXT;
  }
  return null;
};
