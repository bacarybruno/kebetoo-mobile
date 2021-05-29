import { StatusBar } from 'react-native'
import { useContext } from 'react'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import { SafeAreaContext } from '@app/shared/contexts'
import iosColors from '@app/theme/ios-colors'
import { rgbaToHex } from '@app/theme/colors'
import { useAppColors } from '@app/shared/hooks'

const useDarkBackground = (isFocused, hide) => {
  const { resetAppBars } = useAppColors()

  const {
    resetStatusBars,
    updateTabBarTheme,
    updateTopSafeAreaColor,
    updateBottomSafeAreaColor,
  } = useContext(SafeAreaContext)

  if (hide) {
    updateTabBarTheme('hide')
    return
  }
  if (!isFocused) {
    resetStatusBars()
    resetAppBars()
    return
  }
  updateTopSafeAreaColor(iosColors.secondarySystemBackground.dark)
  updateBottomSafeAreaColor(iosColors.secondarySystemBackground.dark)
  changeNavigationBarColor(rgbaToHex(iosColors.secondarySystemBackground.dark))
  StatusBar.setBackgroundColor(iosColors.secondarySystemBackground.dark)
  updateTabBarTheme('dark')
  StatusBar.setBarStyle('light-content')
}

export default useDarkBackground
