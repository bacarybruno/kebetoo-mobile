import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  post: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    paddingTop: metrics.marginHorizontal,
  },
  postHeader: {
    minHeight: metrics.screenHeight * 0.15,
  },
  content: {
    marginBottom: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: metrics.marginHorizontal,
    paddingTop: 0,
  },
  headerBackButton: {
    width: metrics.spacing.xl,
    paddingVertical: metrics.spacing.sm,
    alignItems: 'flex-start',
  },
})
