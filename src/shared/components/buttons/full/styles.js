import { StyleSheet } from 'react-native'

import Colors from 'Kebetoo/src/theme/colors'
import defaultStyles from '../styles'


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
