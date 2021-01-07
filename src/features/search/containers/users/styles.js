import { StyleSheet } from 'react-native'
import { systemWeights } from 'react-native-typography'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
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
    paddingVertical: metrics.spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: metrics.spacing.sm,
  },
  metadata: {
    justifyContent: 'center',
  },
  noContent: {
    height: '100%',
  },
  icon: {
    marginRight: metrics.spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
