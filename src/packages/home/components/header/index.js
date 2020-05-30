import React from 'react'
import { View } from 'react-native'

import Avatar from 'Kebetoo/src/shared/components/avatar'
import Text from 'Kebetoo/src/shared/components/text'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'

export const routeOptions = { headerShown: false }

const Header = ({ displayName, imageSrc, style }) => (
  <View style={[styles.header, style]}>
    <View style={styles.greetings}>
      <Text size="lg">
        {strings.formatString(strings.home.welcome, displayName.split(' ')[0])}
      </Text>
      <Text text={strings.home.whats_new} />
    </View>
    <Avatar src={imageSrc} text={displayName} />
  </View>
)

export default Header
