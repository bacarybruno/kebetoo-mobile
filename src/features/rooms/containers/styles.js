import { metrics } from '@app/theme'
import { StyleSheet } from 'react-native'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: metrics.marginHorizontal,
    backgroundColor: colors.background,
  },
})
