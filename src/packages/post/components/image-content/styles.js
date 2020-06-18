import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'
import elevation from 'Kebetoo/src/theme/elevation'
import colors from 'Kebetoo/src/theme/colors'
import { reactionsHeight } from 'Kebetoo/src/packages/comments/components/reactions/styles'

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
