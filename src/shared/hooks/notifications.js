import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import messaging from '@react-native-firebase/messaging'
import database from '@react-native-firebase/database'

import { notificationsSelector } from '@app/redux/selectors'
import { permissions } from '@app/shared/services'
import * as types from '@app/redux/types'

import useUser from './user'

export const NOTIFICATION_STATUS = {
  NEW: 'notification_status_new',
  SEEN: 'notification_status_seen',
  OPENED: 'notification_status_opened',
}

const notificationsPath = '/notifications'

const useNotifications = () => {
  const dispatch = useDispatch()
  const [notificationsRef] = useState(database().ref(notificationsPath))
  const { profile } = useUser()

  const notifications = useSelector(notificationsSelector)

  const [newItems, setNewItems] = useState([])
  const [seenItems, setSeenItems] = useState([])
  const [badgeCount, setBadgeCount] = useState(0)

  useEffect(() => {
    const newNotifications = []
    const seenNotifications = []
    const notifsBadgeItems = []

    const sortNotifications = (notifA, notifB) => notifB.time - notifA.time

    notifications
      .sort(sortNotifications)
      .forEach((notif) => {
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

  const fetchPendingNotifications = useCallback(async () => {
    const pendingNotifications = (await notificationsRef.child(profile.uid).once('value')).val()
    // persist notifications
    Object.values(pendingNotifications).forEach((pendingNotification) => {
      // only if it isn't already persisted
      if (!notifications.some((notif) => notif.id === pendingNotification.messageId)) {
        persistNotification(pendingNotification)
      }
    })

    // delete notifications because we've already processed them
    const deletePromises = Object.keys(pendingNotifications).map((notificationId) => (
      database().ref(notificationsPath).child(profile.uid).child(notificationId)
        .remove()
    ))
    await Promise.all(deletePromises)
  }, [notificationsRef, profile.uid, notifications, persistNotification])

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
  }, [])

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
    fetchPendingNotifications,
  }
}

export default useNotifications
