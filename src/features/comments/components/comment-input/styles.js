import { StyleSheet } from 'react-native'

import { metrics, elevation } from '@app/theme'

export const bottomBarSize = 45
export default (colors) => StyleSheet.create({
  flexible: {
    flex: 1,
  },
  commentInputWrapper: {
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
    width: '100%',
    flexDirection: 'row',
    paddingBottom: metrics.spacing.sm,
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
    paddingRight: metrics.spacing.sm,
    ...elevation(1),
  },
  textInputWrapperWithReply: {
    borderTopLeftRadius: bottomBarSize / 4,
    borderTopRightRadius: bottomBarSize / 4,
  },
  audioWrapper: {
    marginRight: metrics.spacing.xs,
    flex: 1,
  },
  audioPlayer: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    ...elevation(1),
  },
  reply: {
    marginLeft: metrics.spacing.sm,
  },
})
