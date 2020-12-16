import { StyleSheet } from 'react-native'

import defaultStyles from '../styles'

export default (colors) => StyleSheet.create({
  button: {
    ...defaultStyles(colors).button,
    flexDirection: 'row',
    width: '100%',
  },
  disabledButton: {
    ...defaultStyles(colors).disabledButton,
  },
  loading: {
    ...defaultStyles(colors).loading,
  },
})
