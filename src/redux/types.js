// -- app reducer --
export const SET_THEME = 'app:set_theme'
export const TOGGLE_THEME = 'app:toggle_theme'
export const SET_LOCALE = 'app:set_locale'

// -- user reducers --
export const SET_DISPLAY_NAME = 'user:set_display_name'

// -- posts --
export const API_FETCH_POSTS = 'sagas:api_fetch_posts'
export const API_FETCH_POSTS_SUCCESS = 'sagas:api_fetch_posts_success'
export const CLEAR_POSTS = 'sagas:clear_posts'
export const API_REFRESH_POSTS = 'sagas:api_refresh_posts'
export const API_REFRESH_POSTS_PENDING = 'sagas:api_refresh_posts_pending'
export const API_REFRESH_POSTS_SUCCESS = 'sagas:api_refresh_posts_success'
export const API_REFRESH_POSTS_ERROR = 'sagas:api_refresh_posts_error'
export const API_FETCH_POSTS_ERROR = 'sagas:api_fetch_posts_error'
export const API_FETCH_AUTHORS = 'sagas:api_fetch_authors'
export const API_FETCH_AUTHORS_SUCCESS = 'sagas:api_fetch_authors_success'
export const API_FETCH_AUTHORS_ERROR = 'sagas:api_fetch_authors_error'
export const API_TOGGLE_LIKE_POST = 'sagas:api_toggle_like_post'
export const API_TOGGLE_DISLIKE_POST = 'sagas:api_toggle_dislike_post'
export const API_TOGGLE_LIKE_DISLIKE_ERROR = 'sagas:api_toggle_like_dislike_error'
export const REPLACE_POST = 'sagas:replace_post'
