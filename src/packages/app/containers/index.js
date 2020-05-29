import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import { enableScreens } from 'react-native-screens'

import AppNavigation from 'Kebetoo/src/navigation'
import { appSelector } from 'Kebetoo/src/redux/selectors'
import { SET_THEME } from 'Kebetoo/src/redux/types'

import styles from './styles'

enableScreens()

const RootContainer = () => {
  const { theme } = useSelector(appSelector)
  const defaultTheme = useColorScheme()
  const dispatch = useDispatch()

  useEffect(() => {
    if (theme === null) {
      dispatch({ type: SET_THEME, payload: defaultTheme })
    }
  }, [defaultTheme, dispatch, theme])

  return (
    <SafeAreaView style={styles.wrapper}>
      <AppNavigation />
    </SafeAreaView>
  )
}

export default RootContainer
