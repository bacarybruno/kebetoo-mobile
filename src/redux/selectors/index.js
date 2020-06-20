export const postsSelector = (state) => state.postsReducer.posts
export const authorsSelector = (state) => state.postsReducer.authors
export const userStatsSelector = (state) => state.userReducer.stats
export const displayNameSelector = (state) => state.userReducer.displayName
export const reactionsSelector = (state) => state.postsReducer.reactions
export const appSelector = (state) => state.appReducer
export const selectPostById = (postId) => (state) => {
  const posts = postsSelector(state)
  return posts[postId]
}
export const postsExists = (postId) => (state) => (
  selectPostById(postId)(state) !== undefined
)