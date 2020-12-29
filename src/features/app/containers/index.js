import React, { useEffect } from 'react'
import { StatusBar, AppState, SafeAreaView as RNSafeAreaView, LogBox } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import AppNavigation from '@app/navigation'
import { useAnalytics, useAppColors, useAppStyles, useNotifications } from '@app/shared/hooks'
import { rgbaToHex } from '@app/theme/colors'

import createThemedStyles from './styles'

LogBox.ignoreLogs([
'`setBackgroundColor` is only available on Android'
])
enableScreens()

const RootContainer = () => {
  const { setupNotifications } = useNotifications()
  const { trackAppOpen, trackAppBackground } = useAnalytics()

  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()

  useEffect(() => {
    const appStateChange = (state) => {
      if (state === 'active') trackAppOpen()
      else if (state === 'inactive') trackAppBackground()
    }

    AppState.addEventListener('change', appStateChange)
    return () => {
      AppState.removeEventListener('change', appStateChange)
    }
  }, [trackAppBackground, trackAppOpen])

  useEffect(() => {
    StatusBar.setBackgroundColor(colors.background)
    if (colors.colorScheme === 'dark') {
      changeNavigationBarColor(rgbaToHex(colors.backgroundSecondary))
      StatusBar.setBarStyle('light-content')
    } else {
      changeNavigationBarColor(rgbaToHex(colors.background))
      StatusBar.setBarStyle('dark-content')
    }
  }, [colors])

  useEffect(() => {
    setupNotifications()
  }, [setupNotifications])

  return (
    <>
      <RNSafeAreaView style={styles.topSafeArea} />
      <SafeAreaProvider>
        <SafeAreaView style={styles.wrapper}>
          <AppNavigation />
        </SafeAreaView>
      </SafeAreaProvider>
      <RNSafeAreaView style={styles.bottomSafeArea} />
    </>
  )
}

export default RootContainer
