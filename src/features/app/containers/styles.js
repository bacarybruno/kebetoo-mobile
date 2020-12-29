import { StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomSafeArea: {
    flex: 0,
    backgroundColor: colors.colorScheme === 'dark'
      ? ifIphoneX(colors.backgroundSecondary, colors.background)
      : colors.background,
  },
  topSafeArea: {
    flex: 0,
    backgroundColor: colors.background,
  },
})
