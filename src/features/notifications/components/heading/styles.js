import { StyleSheet } from 'react-native'

import metrics from '@app/theme/metrics'

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: metrics.marginHorizontal,
  },
  headerBadge: {
    marginLeft: 8,
  },
})
