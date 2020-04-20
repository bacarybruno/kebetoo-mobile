import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import { enableScreens } from 'react-native-screens'

import AppNavigation from 'Kebetoo/src/navigation'
import strings from 'Kebetoo/src/config/strings'
import { SET_THEME, SET_LOCALE } from 'Kebetoo/src/redux/types'

import styles from './styles'

enableScreens()

const RootContainer = () => {
  const { theme, locale } = useSelector((state) => state.appReducer)
  const defaultTheme = useColorScheme()
  const dispatch = useDispatch()

  useEffect(() => {
    if (theme === null) {
      dispatch({ type: SET_THEME, payload: defaultTheme })
    }
  })

  useEffect(() => {
    if (locale === null) {
      const defaultLocale = strings.getInterfaceLanguage()
      dispatch({ type: SET_LOCALE, payload: defaultLocale })
      strings.setLanguage(defaultLocale)
    } else {
      strings.setLanguage(locale)
    }
  })

  return (
    <SafeAreaView style={styles.wrapper}>
      <AppNavigation />
    </SafeAreaView>
  )
}

export default RootContainer
