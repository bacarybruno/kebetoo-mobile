import React, {
  useEffect, useCallback, useState, useMemo,
} from 'react'
import { AppState, SafeAreaView as RNSafeAreaView, LogBox } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'

import AppNavigation from '@app/navigation'
import {
  useAnalytics, useAppColors, useAppStyles, useNotifications,
} from '@app/shared/hooks'
import { SafeAreaContext } from '@app/shared/contexts'

import createThemedStyles from './styles'

LogBox.ignoreLogs([
  '`setBackgroundColor` is only available on Android',
])
enableScreens()

const RootContainer = () => {
  const { setupNotifications } = useNotifications()
  const { trackAppOpen, trackAppBackground } = useAnalytics()

  const styles = useAppStyles(createThemedStyles)
  const { colors, resetAppBars } = useAppColors()
  const [topSafeAreaColor, updateTopSafeAreaColor] = useState(colors.background)
  const [bottomSafeAreaColor, updateBottomSafeAreaColor] = useState(colors.background)

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
    setupNotifications()
  }, [setupNotifications])

  const resetStatusBars = useCallback(() => {
    updateTopSafeAreaColor(styles.topSafeArea.backgroundColor)
    updateBottomSafeAreaColor(styles.bottomSafeArea.backgroundColor)
  }, [styles])

  useEffect(() => {
    resetAppBars()
    resetStatusBars()
  }, [colors])

  const safeAreaCtxValue = useMemo(() => ({
    updateTopSafeAreaColor,
    updateBottomSafeAreaColor,
    resetStatusBars,
  }), [resetStatusBars])

  return (
    <SafeAreaContext.Provider value={safeAreaCtxValue}>
      <RNSafeAreaView style={[styles.topSafeArea, { backgroundColor: topSafeAreaColor }]} />
      <SafeAreaProvider>
        <SafeAreaView style={styles.wrapper}>
          <AppNavigation />
        </SafeAreaView>
      </SafeAreaProvider>
      <RNSafeAreaView style={[styles.bottomSafeArea, { backgroundColor: bottomSafeAreaColor }]} />
    </SafeAreaContext.Provider>
  )
}

export default RootContainer
