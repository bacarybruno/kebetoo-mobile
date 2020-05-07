import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'
import colors from 'Kebetoo/src/theme/colors'

export default StyleSheet.create({
  wrapper: {
    minWidth: 64,
    height: 36,
    paddingHorizontal: metrics.marginHorizontal,
    borderColor: colors.primary,
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
