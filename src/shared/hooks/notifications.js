import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import messaging from '@react-native-firebase/messaging'

import { usePermissions } from 'Kebetoo/src/shared/hooks'
import { notificationsSelector } from 'Kebetoo/src/redux/selectors'
import * as types from 'Kebetoo/src/redux/types'

export const NOTIFICATION_STATUS = {
  NEW: 'notification_status_new',
  SEEN: 'notification_status_seen',
  OPENED: 'notification_status_opened',
}

const useNotifications = () => {
  const permissions = usePermissions()
  const dispatch = useDispatch()

  const notifications = useSelector(notificationsSelector)

  const [newItems, setNewItems] = useState([])
  const [seenItems, setSeenItems] = useState([])

  useEffect(() => {
    const newNotifications = []
    const seenNotifications = []
    notifications.forEach((notif) => {
      if (notif.status === NOTIFICATION_STATUS.NEW) {
        newNotifications.push(notif)
      } else {
        seenNotifications.push(notif)
      }
    })
    setNewItems(newNotifications)
    setSeenItems(seenNotifications)
  }, [notifications])

  const persistNotification = useCallback((notification) => {
    dispatch({ type: types.ADD_NOTIFICATION, payload: notification })
  }, [dispatch])

  const updateSeenStatus = useCallback(() => {
    newItems.forEach((newItem) => {
      dispatch({
        type: types.UPDATE_NOTIFICATION_STATUS,
        payload: {
          id: newItem.id,
          status: NOTIFICATION_STATUS.SEEN,
        },
      })
    })
  }, [dispatch, newItems])

  const updateOpenStatus = useCallback((id) => {
    dispatch({
      type: types.UPDATE_NOTIFICATION_STATUS,
      payload: {
        id,
        status: NOTIFICATION_STATUS.OPENED,
      },
    })
  }, [dispatch])

  const setupNotifications = useCallback(async () => {
    const hasPermissions = await permissions.notifications()
    const alreadyRegistered = messaging().isDeviceRegisteredForRemoteMessages
    if (hasPermissions && !alreadyRegistered) {
      await messaging().registerDeviceForRemoteMessages()
    }
  }, [permissions])

  return {
    newItems,
    seenItems,
    updateSeenStatus,
    updateOpenStatus,
    setupNotifications,
    persistNotification,
  }
}

export default useNotifications
