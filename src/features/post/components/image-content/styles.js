import { StyleSheet } from 'react-native'

import { metrics, elevation } from '@app/theme'
import { reactionsHeight } from '@app/features/comments/components/reactions/styles'

export default (colors) => StyleSheet.create({
  commentMode: {
    marginBottom: -reactionsHeight,
  },
  imageViewer: {
    width: metrics.screenWidth,
    marginLeft: -metrics.marginHorizontal,
  },
  imageWrapper: {
    width: '100%',
    backgroundColor: colors.background,
    aspectRatio: metrics.aspectRatio.feed,
    borderColor: colors.border,
    borderWidth: 1,
  },
  flex: {
    flex: 1,
  },
  deleteWrapper: {
    width: 25,
    height: 25,
    backgroundColor: colors.inactive,
    position: 'absolute',
    top: -10,
    right: -10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.round,
    ...elevation(2),
  },
  text: {
    marginBottom: metrics.spacing.sm,
    flex: 1,
  },
})
