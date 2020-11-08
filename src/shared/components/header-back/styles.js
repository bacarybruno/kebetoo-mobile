import { metrics } from '@app/theme'
import { Platform, StyleSheet } from 'react-native'

export default StyleSheet.create({
  wrapper: {
    width: 24,
    marginLeft: Platform.select({ ios: metrics.marginHorizontal, android: 0 }),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
