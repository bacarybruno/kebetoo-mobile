import React from 'react'
import { View } from 'react-native'

import Avatar from 'Kebetoo/src/shared/components/avatar'
import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'

export const routeOptions = { headerShown: false }

const Header = ({ displayName, imageSrc }) => (
  <View style={styles.header}>
    <View style={styles.greetings}>
      <Text size="lg">Hey {displayName.split(' ')[0]},</Text>
      <Text text="what's new in Paris ?" />
    </View>
    <Avatar src={imageSrc} text={displayName} />
  </View>
)

export default Header
