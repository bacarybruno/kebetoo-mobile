import { metrics } from '@app/theme'
import { StyleSheet } from 'react-native'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padding: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  segmentedControl: {
    marginHorizontal: metrics.marginHorizontal,
    marginBottom: metrics.spacing.md,
  },
})
