import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export const swipeableThresold = metrics.screenWidth / 3.5
export const swipeableMargin = 80
const iconWrapperSize = 40

export default (colors) => StyleSheet.create({
  leftAction: {
    justifyContent: 'center',
    width: swipeableThresold,
    paddingLeft: metrics.marginHorizontal,
  },
  leftContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: iconWrapperSize,
    height: iconWrapperSize,
    borderRadius: iconWrapperSize / 2,
    backgroundColor: colors.backgroundSecondary,
  },
})
