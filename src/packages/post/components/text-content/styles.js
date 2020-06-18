import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    backgroundColor: colors.input,
    minHeight: 52,
    padding: metrics.marginHorizontal,
    borderRadius: 5,
    justifyContent: 'center',
  },
})
