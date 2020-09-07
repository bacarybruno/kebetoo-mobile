import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'
import elevation from '@app/theme/elevation'

export default StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundSecondary,
    minHeight: 52,
    padding: metrics.marginHorizontal,
    borderRadius: 5,
  },
  repost: {
    backgroundColor: colors.background,
    minHeight: 0,
    marginBottom: 0,
    padding: 0,
  },
  comments: {
    backgroundColor: colors.backgroundSecondary,
  },
  commentRepost: {
    ...elevation(1),
    backgroundColor: colors.backgroundTertiary,
  },
})
