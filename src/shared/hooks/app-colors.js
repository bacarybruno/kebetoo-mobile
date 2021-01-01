import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { StatusBar, useColorScheme } from 'react-native'

import { appSelector } from '@app/redux/selectors'
import { createThemeColors, rgbaToHex } from '@app/theme/colors'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

const resetAppBarsColors = (colors) => () => {
  StatusBar.setHidden(false)
  StatusBar.setBackgroundColor(colors.background)
  if (colors.colorScheme === 'dark') {
    changeNavigationBarColor(rgbaToHex(colors.backgroundSecondary))
    StatusBar.setBarStyle('light-content')
  } else {
    changeNavigationBarColor(rgbaToHex(colors.background))
    StatusBar.setBarStyle('dark-content')
  }
}

const useAppColors = () => {
  const colorScheme = useColorScheme()
  const theme = useSelector(appSelector)?.theme ?? 'light'
  const themeColorScheme = theme === 'dark' || theme === 'light' ? theme : colorScheme
  const colors = useMemo(() => createThemeColors(themeColorScheme), [themeColorScheme])
  return { colors, resetAppBars: resetAppBarsColors(colors) }
}

export default useAppColors
