import { Appearance } from 'react-native';

import { strings } from '@app/config';

import { SET_LOCALE, SET_THEME } from '../types';

const initialState = {
  locale: strings.getInterfaceLanguage(),
  theme: Appearance.getColorScheme(),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return {
        ...state,
        locale: action.payload,
      };
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
