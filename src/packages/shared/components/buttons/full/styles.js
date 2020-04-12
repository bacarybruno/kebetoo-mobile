import { StyleSheet } from 'react-native'
import defaultStyles from '../styles'
import Colors from '../../../../../theme/colors'

export default StyleSheet.create({
  button: {
    ...defaultStyles.button,
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: Colors.white,
  },
})
