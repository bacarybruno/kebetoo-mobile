import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 56,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    marginBottom: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionList: {
    textAlign: 'center',
  },
  sectionListContent: {
    marginTop: metrics.marginVertical,
    flexGrow: 1,
    paddingHorizontal: metrics.marginHorizontal,
    paddingBottom: metrics.marginVertical,
  },
  fab: {
    fontSize: 30,
  },
})
