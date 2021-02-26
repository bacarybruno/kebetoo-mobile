export const postsSelector = (state) => state.postsReducer.posts
export const userStatsSelector = (state) => state.userReducer.stats
export const userProfileSelector = (state) => state.userReducer.profile
export const recentSearchHistory = (state) => state.userReducer.searchHistory
export const blockedItemsSelector = (state) => ({
  posts: state.userReducer.hiddenPosts,
  authors: state.userReducer.blockedAuthors,
})
export const appSelector = (state) => state.appReducer
export const emojiHistorySelector = (state) => state.appReducer.emojiHistory
export const localeSelector = (state) => state.appReducer.locale
export const notificationsSelector = (state) => state
  .notificationsReducer
  .notifications
  .sort((a, b) => b.time - a.time)
