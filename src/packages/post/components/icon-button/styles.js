import { StyleSheet } from 'react-native'
import colors from 'Kebetoo/src/theme/colors'

const size = 40

export default StyleSheet.create({
  button: {
    backgroundColor: colors.input,
    width: size,
    height: size,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
