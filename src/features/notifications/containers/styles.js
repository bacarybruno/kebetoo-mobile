import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'

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
