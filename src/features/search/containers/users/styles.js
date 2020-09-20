import { StyleSheet } from 'react-native'
import { systemWeights } from 'react-native-typography'

import { colors, metrics } from '@app/theme'

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
  searchResult: {
    flexDirection: 'row',
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: 8,
  },
  metadata: {
    justifyContent: 'center',
  },
})
