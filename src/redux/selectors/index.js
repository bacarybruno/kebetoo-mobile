export const postsSelector = (state) => state.postsReducer.posts
export const authorsSelector = (state) => state.postsReducer.authors
export const commentsSelector = (state) => state.postsReducer.comments
export const userStatsSelector = (state) => state.userReducer.stats
export const displayNameSelector = (state) => state.userReducer.displayName
export const reactionsSelector = (state) => state.postsReducer.reactions
