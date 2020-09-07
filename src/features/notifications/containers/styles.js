import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageTitle: {
    paddingHorizontal: metrics.marginHorizontal,
    marginBottom: metrics.marginVertical / 2,
  },
  content: {
    paddingBottom: metrics.marginVertical,
  },
  section: {
    marginBottom: metrics.marginVertical * 1.2,
  },
})
