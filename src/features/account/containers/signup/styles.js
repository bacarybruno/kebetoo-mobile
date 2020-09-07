import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
    paddingVertical: metrics.marginVertical,
  },
  normalSignUp: {
    flex: 3,
    maxHeight: 380,
    justifyContent: 'space-between',
  },
  footerText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
})
