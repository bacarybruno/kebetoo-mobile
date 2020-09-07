import React, { useEffect } from 'react'
import { useColorScheme, StatusBar, Appearance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import { enableScreens } from 'react-native-screens'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import AppNavigation from '@app/navigation'
import { appSelector } from '@app/redux/selectors'
import { SET_THEME } from '@app/redux/types'
import colors, { rgbaToHex } from '@app/theme/colors'
import { useNotifications } from '@app/shared/hooks'

import styles from './styles'

enableScreens()

const RootContainer = () => {
  const { theme } = useSelector(appSelector)
  const defaultTheme = useColorScheme()
  const dispatch = useDispatch()
  const { setupNotifications } = useNotifications()

  useEffect(() => {
    if (theme === null) {
      dispatch({ type: SET_THEME, payload: defaultTheme })
    }
    const colorScheme = Appearance.getColorScheme()
    if (colorScheme === 'dark') {
      StatusBar.setBackgroundColor(colors.backgroundSecondary)
      changeNavigationBarColor(rgbaToHex(colors.backgroundSecondary))
    }
  }, [defaultTheme, dispatch, theme])

  useEffect(() => {
    setupNotifications()
  }, [setupNotifications])

  return (
    <SafeAreaView style={styles.wrapper}>
      <AppNavigation />
    </SafeAreaView>
  )
}

export default RootContainer
