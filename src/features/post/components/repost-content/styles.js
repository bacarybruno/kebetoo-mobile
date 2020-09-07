import { StyleSheet } from 'react-native'

import metrics from '@app/theme/metrics'
import colors from '@app/theme/colors'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    minHeight: 52,
    marginVertical: 8,
    borderLeftWidth: 2,
    borderColor: colors.border,
    paddingLeft: metrics.marginHorizontal / 2,
  },
  imageContent: {
    paddingLeft: 0,
    borderLeftWidth: 0,
  },
})
