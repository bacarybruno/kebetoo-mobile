import React, {
  useEffect, useCallback, useState, useMemo,
} from 'react'
import { AppState, SafeAreaView as RNSafeAreaView, LogBox } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import { useDispatch, useSelector } from 'react-redux'

import AppNavigation from '@app/navigation'
import {
  useAnalytics, useAppColors, useAppStyles, useNotifications,
} from '@app/shared/hooks'
import { SafeAreaContext } from '@app/shared/contexts'
import { localeSelector } from '@app/redux/selectors'
import strings, { updateAppLocale } from '@app/config/strings'
import { SET_LOCALE } from '@app/redux/types'

import createThemedStyles from './styles'

LogBox.ignoreLogs([
  '`setBackgroundColor` is only available on Android',
])
enableScreens()

const RootContainer = () => {
  const { setupNotifications } = useNotifications()
  const { trackAppOpen, trackAppBackground } = useAnalytics()
  const dispatch = useDispatch()

  const styles = useAppStyles(createThemedStyles)
  const { colors, resetAppBars } = useAppColors()
  const [topSafeAreaColor, updateTopSafeAreaColor] = useState(colors.background)
  const [bottomSafeAreaColor, updateBottomSafeAreaColor] = useState(colors.background)
  const locale = useSelector(localeSelector)

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

  useEffect(() => {
    if (locale) {
      updateAppLocale(locale)
    } else {
      dispatch({ type: SET_LOCALE, payload: strings.getInterfaceLanguage() })
    }
  }, [locale])

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
          <AppNavigation key={`lang-${locale}`} />
        </SafeAreaView>
      </SafeAreaProvider>
      <RNSafeAreaView style={[styles.bottomSafeArea, { backgroundColor: bottomSafeAreaColor }]} />
    </SafeAreaContext.Provider>
  )
}

export default RootContainer
