import { StyleSheet } from 'react-native'
import defaultStyles from '../styles'
import Colors from '../../../../../theme/colors'

export default StyleSheet.create({
  button: {
    ...defaultStyles.button,
    width: 57,
    backgroundColor: Colors.primary,
  },
  icon: {
    color: Colors.white,
  },
})
