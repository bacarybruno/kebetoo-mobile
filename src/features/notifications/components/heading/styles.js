import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
    paddingHorizontal: metrics.marginHorizontal,
  },
  headerBadge: {
    marginLeft: metrics.spacing.sm,
  },
})
