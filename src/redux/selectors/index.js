export const postsSelector = (state) => state.postsReducer.posts
export const authorsSelector = (state) => state.postsReducer.authors
export const likesSelector = (state) => state.postsReducer.likes
export const dislikesSelector = (state) => state.postsReducer.dislikes
export const commentsSelector = (state) => state.postsReducer.comments
export const displayNameSelector = (state) => state.userReducer.displayName
