import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'
import colors from 'Kebetoo/src/theme/colors'
import elevation from 'Kebetoo/src/theme/elevation'

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
    backgroundColor: colors.white_darken,
    borderWidth: StyleSheet.hairlineWidth,
    ...elevation(1),
  },
  audioWrapper: {
    marginRight: 10,
    backgroundColor: colors.white_darken,
    borderColor: '#E8E8E8',
    borderWidth: StyleSheet.hairlineWidth,
    ...elevation(1),
  },
})
