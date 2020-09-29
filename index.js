import { AppRegistry } from 'react-native'
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging'
import { KeyboardRegistry } from 'react-native-ui-lib/keyboard'

import { EmojiSelector } from '@app/shared/components'
import { keyboardName } from '@app/shared/components/emoji-selector'

import { name as appName } from './app.json'
import App from './src'

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const bgNotifications = JSON.parse(await AsyncStorage.getItem('backgroundNotifications')) || []
  bgNotifications.push(remoteMessage)
  PushNotification.setApplicationIconBadgeNumber(bgNotifications.length)
  await AsyncStorage.setItem('backgroundNotifications', JSON.stringify(bgNotifications))
})

AppRegistry.registerComponent(appName, () => App)
KeyboardRegistry.registerKeyboard(keyboardName, () => EmojiSelector)
