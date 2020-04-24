import { combineReducers } from 'redux'

import appReducer from './app'
import userReducer from './user'
import postsReducer from './posts'

export default combineReducers({
  appReducer,
  userReducer,
  postsReducer,
})
