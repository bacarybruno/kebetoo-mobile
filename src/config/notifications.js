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

// handle background notifications
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const bgNotifications = JSON.parse(await AsyncStorage.getItem('backgroundNotifications')) || []
  bgNotifications.push(remoteMessage)
  PushNotification.setApplicationIconBadgeNumber(bgNotifications.length)
  await AsyncStorage.setItem('backgroundNotifications', JSON.stringify(bgNotifications))

  const notificationTitle = getNotificationTitle(remoteMessage)
  if (!notificationTitle) return
  PushNotification.localNotification({
    channelId: 'kbt',
    title: `${notificationTitle.name} ${notificationTitle.message}`,
    message: getNotificationMessage(remoteMessage),
    smallIcon: 'ic_notification',
  })
})
