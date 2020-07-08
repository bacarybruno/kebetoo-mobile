import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundSecondary,
    minHeight: 52,
    padding: metrics.marginHorizontal,
    borderRadius: 5,
  },
  repost: {
    backgroundColor: colors.background,
    minHeight: 0,
    marginBottom: 0,
    padding: 0,
  },
})
