import React from 'react'
import { AppRegistry } from 'react-native'

import { KeyboardRegistry } from 'react-native-ui-lib/keyboard'

import '@app/shared/helpers/polyfills'
import '@app/config/notifications'
import '@app/config/firebase'

import { EmojiSelector } from '@app/shared/components'
import { keyboardName } from '@app/shared/components/emoji-selector'

import { name as appName } from './app.json'
import App from './src'

const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) return null
  return <App />
}

AppRegistry.registerComponent(appName, () => HeadlessCheck)
KeyboardRegistry.registerKeyboard(keyboardName, () => EmojiSelector)
