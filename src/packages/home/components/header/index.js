import React from 'react'
import { View, Text } from 'react-native'

import Avatar from 'Kebetoo/src/shared/components/avatar'

import styles from './styles'

export const routeOptions = { headerShown: false }

export default ({ username, imageSrc }) => (
  <View style={styles.header}>
    <View style={styles.greetings}>
      <Text style={styles.greetingTitle}>Hey {username},</Text>
      <Text style={styles.greetingSubtitle}>what's new in Ramallah ?</Text>
    </View>
    <Avatar src={imageSrc} />
  </View>
)
