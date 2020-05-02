// -- app reducer --
export const SET_THEME = 'app:set_theme'
export const TOGGLE_THEME = 'app:toggle_theme'
export const SET_LOCALE = 'app:set_locale'

// -- user reducers --
export const SET_DISPLAY_NAME = 'user:set_display_name'

// -- posts --
export const API_FETCH_POSTS = 'sagas:api_fetch_posts'
export const API_FETCH_POSTS_SUCCESS = 'sagas:api_fetch_posts_success'
export const API_FETCH_POSTS_ERROR = 'sagas:api_fetch_posts_error'
export const API_FETCH_AUTHORS = 'sagas:api_fetch_authors'
export const API_FETCH_AUTHORS_SUCCESS = 'sagas:api_fetch_authors_success'
export const API_FETCH_AUTHORS_ERROR = 'sagas:api_fetch_authors_error'
export const API_TOGGLE_LIKE_POST = 'sagas:api_toggle_like_post'
export const API_TOGGLE_DISLIKE_POST = 'sagas:api_toggle_dislike_post'
export const API_TOGGLE_LIKE_DISLIKE_ERROR = 'sagas:api_toggle_like_dislike_error'
export const REPLACE_POSTS = 'sagas:replace_posts'
export const REPLACE_POST = 'sagas:replace_post'
export const API_FETCH_COMMENTS_SUCCESS = 'sagas:api_fetch_comments_success'
export const API_FETCH_LIKES_SUCCESS = 'sagas:api_fetch_likes_success'
export const API_FETCH_DISLIKES_SUCCESS = 'sagas:api_fetch_dislikes_success'
export const LIKE_SUCCESS = 'sagas:api_fetch_like_success'
export const DISLIKE_SUCCESS = 'sagas:api_fetch_dislike_success'
export const DELETE_LIKE_SUCCESS = 'sagas:api_fetch_delete_like_success'
export const DELETE_DISLIKE_SUCCESS = 'sagas:api_fetch_delete_dislike_success'
