import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export const paddingHorizontal = metrics.marginHorizontal * 1.5
export const borderRadiusSize = 55
export const bottomBarSize = 45
export default StyleSheet.create({
  reactionsContainer: {
    height: borderRadiusSize,
    borderTopLeftRadius: borderRadiusSize,
    borderTopRightRadius: borderRadiusSize,
    paddingHorizontal,
    backgroundColor: colors.background,
  },
  reactions: {
    flex: 1,
    justifyContent: 'flex-end',
  },
})