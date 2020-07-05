import React from 'react'
import { View } from 'react-native'

import Avatar from 'Kebetoo/src/shared/components/avatar'
import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'

export const routeOptions = { headerShown: false }

const Header = ({ displayName, imageSrc, style }) => (
  <View style={[styles.header, style]}>
    <View style={styles.greetings}>
      <Typography
        text={strings.formatString(strings.home.welcome, displayName.split(' ')[0])}
        type={types.headline2}
      />
      <Typography text={strings.home.whats_new} type={types.subheading} />
    </View>
    <Avatar src={imageSrc} text={displayName} />
  </View>
)

export default Header
