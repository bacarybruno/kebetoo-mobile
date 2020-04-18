import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import defaultStyles from '../styles'


export default StyleSheet.create({
  button: {
    ...defaultStyles.button,
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: colors.white,
  },
})
