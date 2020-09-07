import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 20,
  },
  flatlistContent: {
    paddingHorizontal: metrics.marginHorizontal,
    paddingBottom: metrics.tabBarFullHeight - metrics.tabBarHeight,
  },
})
