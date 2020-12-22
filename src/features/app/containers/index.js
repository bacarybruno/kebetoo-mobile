import React, { useEffect } from 'react'
import { StatusBar, AppState } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import AppNavigation from '@app/navigation'
import { useAnalytics, useAppColors, useNotifications } from '@app/shared/hooks'
import { rgbaToHex } from '@app/theme/colors'

import styles from './styles'

enableScreens()

const RootContainer = () => {
  const { setupNotifications } = useNotifications()
  const { trackAppOpen, trackAppBackground } = useAnalytics()

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
    <SafeAreaView style={styles.wrapper}>
      <AppNavigation />
    </SafeAreaView>
  )
}

export default RootContainer
