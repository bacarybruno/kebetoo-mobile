import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging'

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
  PushNotification.localNotification({
    channelId: 'kbt',
    title: remoteMessage.data.title,
    message: remoteMessage.data.message,
    smallIcon: 'ic_notification',
  })
})
