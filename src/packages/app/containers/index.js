import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import NavigationContainer from '../../../navigation'
import { SET_THEME, SET_LOCALE } from '../../../redux/types'

import strings from '../../../config/strings'

enableScreens()

export default () => {
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
    }
    strings.setLanguage(locale)
  })

  return (
    <SafeAreaView>
      <NavigationContainer />
    </SafeAreaView>
  )
}
