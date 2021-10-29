import { combineReducers } from 'redux';

import appReducer from './app';
import userReducer from './user';
import postsReducer from './posts';
import notificationsReducer from './notifications';

export default combineReducers({
  appReducer,
  userReducer,
  postsReducer,
  notificationsReducer,
});
