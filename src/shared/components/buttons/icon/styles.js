import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import defaultStyles from '../styles'

export default StyleSheet.create({
  button: {
    ...defaultStyles.button,
    width: 57,
    backgroundColor: colors.primary,
  },
  icon: {
    color: colors.white,
  },
})
