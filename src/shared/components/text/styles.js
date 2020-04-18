import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  wrapper: {
    fontFamily: Platform.select({ ios: 'Helvetica', android: 'Roboto' }),
  },
})
