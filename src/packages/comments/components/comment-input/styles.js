import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'
import colors from 'Kebetoo/src/theme/colors'

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
    alignItems: 'center',
    paddingBottom: 10,
  },
  textInputSize: {
    height: bottomBarSize,
    minHeight: bottomBarSize,
  },
  textInputWrapper: {
    borderRadius: 100,
  },
})
