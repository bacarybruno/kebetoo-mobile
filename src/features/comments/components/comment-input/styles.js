import { StyleSheet } from 'react-native'

import metrics from '@app/theme/metrics'
import colors from '@app/theme/colors'
import elevation from '@app/theme/elevation'

export const bottomBarSize = 45
export default StyleSheet.create({
  flexible: {
    flex: 1,
  },
  commentInputWrapper: {
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  textInputSize: {
    minHeight: bottomBarSize,
  },
  textInputWrapper: {
    borderRadius: bottomBarSize / 2,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    ...elevation(1),
  },
  audioWrapper: {
    marginRight: 4,
    flex: 1,
  },
  audioPlayer: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    ...elevation(1),
  },
})
