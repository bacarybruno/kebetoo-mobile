import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  draggableContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    width: 60,
    height: 5,
    borderRadius: metrics.radius.sm,
    margin: metrics.spacing.sm,
    backgroundColor: colors.border,
  },
})
