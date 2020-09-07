import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

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
