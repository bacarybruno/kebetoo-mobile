import { combineReducers } from 'redux'

import { SET_LOCALE, SET_THEME } from '../types'

const initialState = {
  locale: null,
  theme: 'light',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return {
        ...state,
        locale: action.payload,
      }
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      }
    default:
      return state
  }
}

export default reducer
