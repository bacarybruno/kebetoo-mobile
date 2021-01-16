import React from 'react'
import { AppRegistry } from 'react-native'
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging'
import { KeyboardRegistry } from 'react-native-ui-lib/keyboard'
import { utils } from '@react-native-firebase/app'
import analytics from '@react-native-firebase/analytics'

import { EmojiSelector } from '@app/shared/components'
import { keyboardName } from '@app/shared/components/emoji-selector'

import { name as appName } from './app.json'
import App from './src'

// handle background notifications
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const bgNotifications = JSON.parse(await AsyncStorage.getItem('backgroundNotifications')) || []
  bgNotifications.push(remoteMessage)
  PushNotification.setApplicationIconBadgeNumber(bgNotifications.length)
  await AsyncStorage.setItem('backgroundNotifications', JSON.stringify(bgNotifications))
})

if (utils().isRunningInTestLab) {
  // do not track analytics for firebase test lab
  // used by google play to run test on publish
  analytics().setAnalyticsCollectionEnabled(false)
}

const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) return null
  return <App />
}

AppRegistry.registerComponent(appName, () => HeadlessCheck)
KeyboardRegistry.registerKeyboard(keyboardName, () => EmojiSelector)
