import React from 'react'
import { View } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'
import styles from './styles'

export const routeOptions = { title: 'Profile' }

const ProfilePage = () => (
  <View style={styles.wrapper}>
    <Text text="Hello Profile" />
  </View>
)

export default ProfilePage
