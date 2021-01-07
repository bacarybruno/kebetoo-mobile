import { StyleSheet } from 'react-native'

import { elevation, metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  text: {
    marginBottom: metrics.spacing.sm,
  },
  comment: {
    backgroundColor: colors.backgroundTertiary,
    ...elevation(1),
  },
})
