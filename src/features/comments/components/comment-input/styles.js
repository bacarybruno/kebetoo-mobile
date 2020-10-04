import { StyleSheet } from 'react-native'

import { colors, metrics, elevation } from '@app/theme'

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
    paddingBottom: 10,
  },
  textInputSize: {
    minHeight: bottomBarSize,
  },
  textInputWrapper: {
    borderBottomLeftRadius: bottomBarSize / 2,
    borderBottomRightRadius: bottomBarSize / 2,
    borderTopLeftRadius: bottomBarSize / 2,
    borderTopRightRadius: bottomBarSize / 2,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    ...elevation(1),
  },
  textInputWrapperWithReply: {
    borderTopLeftRadius: bottomBarSize / 4,
    borderTopRightRadius: bottomBarSize / 4,
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
