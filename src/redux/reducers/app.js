import { combineReducers } from 'redux'

const locale = (state = null, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const theme = (state = null, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const app = combineReducers({
  locale,
  theme,
})

export default app
