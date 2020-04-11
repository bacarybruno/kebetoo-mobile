import { combineReducers } from 'redux'
import { SET_LOCALE, SET_THEME } from '../types'

const locale = (state = null, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return action.payload
    default:
      return state
  }
}

const theme = (state = null, action) => {
  switch (action.type) {
    case SET_THEME:
      return action.payload
    default:
      return state
  }
}

const app = combineReducers({
  locale,
  theme,
})

export default app
