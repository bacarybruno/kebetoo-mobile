import { StyleSheet } from 'react-native'
import { systemWeights } from 'react-native-typography'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  paddingHorizontal: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  sectionHeader: {
    marginVertical: metrics.marginVertical / 1.3,
    color: colors.textPrimary,
    ...systemWeights.semibold,
  },
  sectionHeaderLink: {
    color: colors.link,
    ...systemWeights.bold,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flatlistContent: {
    paddingBottom: metrics.tabBarFullHeight - metrics.tabBarHeight,
  },
})
