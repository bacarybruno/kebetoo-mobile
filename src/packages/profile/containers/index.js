import React from 'react'
import { View } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'
import styles from './styles'

export const routeOptions = { title: 'Profile' }

export default () => (
  <View style={styles.wrapper}>
    <Text text="Hello Profile" />
  </View>
)
