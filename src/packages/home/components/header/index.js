import React from 'react'
import { View } from 'react-native'

import Avatar from 'Kebetoo/src/shared/components/avatar'
import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'

export const routeOptions = { headerShown: false }

export default ({ username, imageSrc }) => (
  <View style={styles.header}>
    <View style={styles.greetings}>
      <Text size="lg">Hey {username},</Text>
      <Text text="what's new in Ramallah ?" />
    </View>
    <Avatar src={imageSrc} text={username} />
  </View>
)
