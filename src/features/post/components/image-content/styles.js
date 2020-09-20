import { StyleSheet } from 'react-native'

import { colors, metrics, elevation } from '@app/theme'
import { reactionsHeight } from '@app/features/comments/components/reactions/styles'

export default StyleSheet.create({
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
    borderRadius: 15,
    ...elevation(2),
  },
  text: {
    marginBottom: 8,
    flex: 1,
  },
})
