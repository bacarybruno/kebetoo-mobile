import { PixelRatio, StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export const iconSize = Math.min(110 / PixelRatio.get(), 40)

export default (colors) => StyleSheet.create({
  reactions: {
    position: 'absolute',
    bottom: metrics.spacing.xl,
  },
  left: {
    left: metrics.spacing.md,
  },
  right: {
    right: metrics.spacing.md,
  },
  reaction: {
    marginBottom: metrics.spacing.md,
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    textAlign: 'center',
  },
  icon: {
    shadowOpacity: 2,
    textShadowRadius: 1,
    textShadowOffset: { width: 1, height: 1 }
  },
  disabled: {
    opacity: 0.4,
  },
})