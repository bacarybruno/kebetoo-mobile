import { Appearance } from 'react-native'

import { SET_LOCALE, SET_THEME, SET_EMOJI_HISTORY } from '../types'

const initialState = {
  locale: 'fr',
  theme: Appearance.getColorScheme(),
  emojiHistory: [],
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
    case SET_EMOJI_HISTORY:
      return {
        ...state,
        emojiHistory: action.payload,
      }
    default:
      return state
  }
}

export default reducer
