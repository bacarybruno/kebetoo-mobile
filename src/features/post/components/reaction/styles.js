import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default StyleSheet.create({
  reaction: {
    flexDirection: 'row',
    minWidth: 35,
    marginRight: metrics.spacing.md,
    alignItems: 'center',
  },
  icon: {
    marginRight: metrics.spacing.xs,
  },
})
