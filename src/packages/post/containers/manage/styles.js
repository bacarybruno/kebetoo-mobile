import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: metrics.marginVertical,
    paddingHorizontal: metrics.marginHorizontal,
  },
  sectionHeader: {
    marginBottom: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})
