import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

import Typography from '../typography'

export default StyleSheet.create({
  reveal: {
    marginTop: metrics.spacing.xs,
    fontSize: Typography.fontSizes.sm,
    opacity: 0.75,
  },
})
