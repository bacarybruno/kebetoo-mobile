import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

const imageSize = 30
export default (colors) => StyleSheet.create({
  wrapper: {
    width: imageSize,
    height: imageSize,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.round,
    backgroundColor: colors.primary,
  },
  badgeWrapper: {
    backgroundColor: colors.background,
    padding: 2,
    position: 'absolute',
    top: -4,
    left: -6,
    borderRadius: metrics.radius.round,
  },
  badge: {
    backgroundColor: colors.pink,
    width: 20,
    height: 20,
    borderRadius: metrics.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
