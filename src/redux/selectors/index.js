export const postsSelector = (state) => state.postsReducer.posts
export const userStatsSelector = (state) => state.userReducer.stats
export const displayNameSelector = (state) => state.userReducer.displayName
export const recentSearchHistory = (state) => state.userReducer.searchHistory
export const appSelector = (state) => state.appReducer
export const emojiHistorySelector = (state) => state.appReducer.emojiHistory
export const notificationsSelector = (state) => state
  .notificationsReducer
  .notifications
  .sort((a, b) => b.time - a.time)
