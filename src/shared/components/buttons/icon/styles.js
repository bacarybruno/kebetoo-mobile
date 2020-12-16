import { StyleSheet } from 'react-native'

import defaultStyles from '../styles'

export default (colors) => StyleSheet.create({
  button: {
    ...defaultStyles(colors).button,
    width: 57,
    backgroundColor: colors.primary,
  },
  icon: {
    color: colors.white,
  },
})
