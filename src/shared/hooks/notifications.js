import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import messaging from '@react-native-firebase/messaging'

import { usePermissions } from '@app/shared/hooks'
import { notificationsSelector } from '@app/redux/selectors'
import * as types from '@app/redux/types'

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
  const [badgeCount, setBadgeCount] = useState(0)

  useEffect(() => {
    const newNotifications = []
    const seenNotifications = []
    const notifsBadgeItems = []

    notifications.forEach((notif) => {
      switch (notif.status) {
        case NOTIFICATION_STATUS.NEW:
          newNotifications.push(notif)
          notifsBadgeItems.push(notif)
          break
        case NOTIFICATION_STATUS.OPENED:
          seenNotifications.push(notif)
          break
        case NOTIFICATION_STATUS.SEEN:
          seenNotifications.push(notif)
          notifsBadgeItems.push(notif)
          break
        default:
          break
      }
    })

    setNewItems(newNotifications)
    setSeenItems(seenNotifications)
    setBadgeCount(notifsBadgeItems.length)
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
    badgeCount,
    readableBadgeCount: badgeCount > 9 ? '9+' : badgeCount,
    isEmpty: notifications.length === 0,
    updateSeenStatus,
    updateOpenStatus,
    setupNotifications,
    persistNotification,
  }
}

export default useNotifications
