import React, { useEffect } from 'react'
import { useColorScheme, StatusBar, Appearance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import { enableScreens } from 'react-native-screens'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import messaging from '@react-native-firebase/messaging'

import AppNavigation from 'Kebetoo/src/navigation'
import { appSelector } from 'Kebetoo/src/redux/selectors'
import { SET_THEME } from 'Kebetoo/src/redux/types'
import colors, { rgbaToHex } from 'Kebetoo/src/theme/colors'
import { usePermissions } from 'Kebetoo/src/shared/hooks'

import styles from './styles'

enableScreens()

const RootContainer = () => {
  const { theme } = useSelector(appSelector)
  const defaultTheme = useColorScheme()
  const dispatch = useDispatch()
  const permissions = usePermissions()

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
    const setupNotifications = async () => {
      const hasPermissions = await permissions.notifications()
      const alreadyRegistered = messaging().isDeviceRegisteredForRemoteMessages
      if (hasPermissions && !alreadyRegistered) {
        await messaging().registerDeviceForRemoteMessages()
      }
    }
    setupNotifications()
  }, [permissions])

  return (
    <SafeAreaView style={styles.wrapper}>
      <AppNavigation />
    </SafeAreaView>
  )
}

export default RootContainer
