import { Platform } from 'react-native'
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging'

import { getNotificationMessage, getNotificationTitle } from '@app/features/notifications/containers'

PushNotification.createChannel({
  channelId: 'kbt',
  channelName: 'Kebetoo Channel',
  channelDescription: 'Local notifications sent by Kebetoo',
  playSound: false,
})

const formatNotificationMessage = ({ name, message }) => `${name} ${message}`

PushNotification.configure({
  requestPermissions: Platform.OS === 'ios',
})

// handle background notifications
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const bgNotifications = JSON.parse(await AsyncStorage.getItem('backgroundNotifications')) || []
  bgNotifications.push(remoteMessage)
  PushNotification.setApplicationIconBadgeNumber(bgNotifications.length)
  await AsyncStorage.setItem('backgroundNotifications', JSON.stringify(bgNotifications))

  const notificationTitle = getNotificationTitle(remoteMessage)
  if (!notificationTitle && !remoteMessage.data.title) return

  PushNotification.localNotification({
    channelId: 'kbt',
    title: notificationTitle
      ? formatNotificationMessage(notificationTitle)
      : remoteMessage.data.title,
    message: getNotificationMessage(remoteMessage) || remoteMessage.data.message,
    smallIcon: 'ic_stat_ic_notification',
  })
})
