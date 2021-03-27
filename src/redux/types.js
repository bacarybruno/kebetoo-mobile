// -- app reducer --
export const SET_THEME = 'app:set_theme'
export const TOGGLE_THEME = 'app:toggle_theme'
export const SET_LOCALE = 'app:set_locale'
export const SET_EMOJI_HISTORY = 'app:set_emoji_history'
export const ADD_EMOJI_HISTORY = 'app:add_emoji_history'
export const ADD_EMOJI_HISTORY_ERROR = 'app:add_emoji_history_error'

// -- user reducer --
export const SET_USER_PROFILE = 'user:set_user_profile'
export const SET_USER_PROFILE_REQUEST = 'user:set_user_profile_request'
export const SET_USER_PROFILE_ERROR = 'user:set_user_profile_error'
export const SET_USER_STATS = 'user:set_user_stats'
export const ADD_POST_HISTORY = 'user:add_post_history'
export const REMOVE_POST_HISTORY = 'user:remove_post_history'
export const CLEAR_POST_HISTORY = 'user:clear_post_history'
export const ADD_USER_HISTORY = 'user:add_user_history'
export const REMOVE_USER_HISTORY = 'user:remove_user_history'
export const CLEAR_USER_HISTORY = 'user:clear_user_history'
export const LOGOUT = 'user:logout'
export const HIDE_POST = 'user:hide_post'
export const BLOCK_AUTHOR = 'user:block_author'

// -- post reducer --
export const API_FETCH_POSTS = 'sagas:api_fetch_posts'
export const API_FETCH_POSTS_SUCCESS = 'sagas:api_fetch_posts_success'
export const API_FETCH_POSTS_ERROR = 'sagas:api_fetch_posts_error'
export const API_REACT_POST = 'sagas:api_react_post'
export const API_REACT_POST_ERROR = 'sagas:api_react_post_error'
export const REPLACE_POSTS = 'sagas:replace_posts'
export const IS_LOADING_POSTS = 'sagas:is_loading_posts'

// -- notifications reducer --
export const ADD_NOTIFICATION = 'notifications:add_notification'
export const UPDATE_NOTIFICATION_STATUS = 'notifications:update_notification_status'
