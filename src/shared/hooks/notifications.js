import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-community/async-storage'

import { usePermissions } from 'Kebetoo/src/shared/hooks'
import { notificationsSelector } from 'Kebetoo/src/redux/selectors'
import * as api from 'Kebetoo/src/shared/helpers/http'
import * as types from 'Kebetoo/src/redux/types'

import useUser from './user'

export const NOTIFICATION_STATUS = {
  NEW: 'notification_status_new',
  SEEN: 'notification_status_seen',
  OPENED: 'notification_status_opened',
}

const useNotifications = () => {
  const permissions = usePermissions()
  const { isLoggedIn, profile } = useUser()
  const dispatch = useDispatch()
  const notifications = useSelector(notificationsSelector)

  const setupNotifications = useCallback(async () => {
    const hasPermissions = await permissions.notifications()
    const alreadyRegistered = messaging().isDeviceRegisteredForRemoteMessages
    if (hasPermissions && !alreadyRegistered) {
      await messaging().registerDeviceForRemoteMessages()
    }
  }, [permissions])

  const persistNotification = useCallback((notification) => {
    dispatch({ type: types.ADD_NOTIFICATION, payload: notification })
  }, [dispatch])

  const handleNotification = useCallback((remoteMessage) => {
    if (remoteMessage !== null) {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
        remoteMessage.data,
      )
    }
  }, [])

  const handleInitialNotification = useCallback((remoteMessage) => {
    if (remoteMessage !== null) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
        remoteMessage.data,
      )
    }
  }, [])

  useEffect(() => {
    messaging().onNotificationOpenedApp(handleNotification)
    messaging().getInitialNotification().then(handleInitialNotification)
    const unsubscribeForegroundNotification = messaging().onMessage(persistNotification)
    return unsubscribeForegroundNotification
  }, [handleInitialNotification, handleNotification, persistNotification])

  useEffect(() => {
    const updateUserNotificationId = async () => {
      const deviceRegistered = messaging().isDeviceRegisteredForRemoteMessages
      if (isLoggedIn && profile.uid && deviceRegistered) {
        const notificationToken = await messaging().getToken()
        api.updateAuthor(profile.uid, { notificationToken })
      }
    }

    updateUserNotificationId()

    const unsubscribeTokenRefresh = messaging().onTokenRefresh((notificationToken) => {
      api.updateAuthor(profile.uid, { notificationToken })
    })
    return unsubscribeTokenRefresh
  }, [isLoggedIn, profile])

  useEffect(() => {
    const handleBackgroundNotifications = async () => {
      // save background notifications in redux
      // with a default status of "new"
      const bgNotifications = JSON.parse(await AsyncStorage.getItem('backgroundNotifications')) || []
      bgNotifications.forEach(persistNotification)

      // remove background notifications
      await AsyncStorage.removeItem('backgroundNotifications')
      // reset badge number
      PushNotification.setApplicationIconBadgeNumber(0)
    }

    handleBackgroundNotifications()
  }, [dispatch, persistNotification])

  return {
    notifications,
    setupNotifications,
  }
}

export default useNotifications
