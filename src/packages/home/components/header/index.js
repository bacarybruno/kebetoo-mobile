import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import Avatar from 'Kebetoo/src/shared/components/avatar'
import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import strings from 'Kebetoo/src/config/strings'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

export const routeOptions = { headerShown: false }

const Header = ({
  displayName = ' ',
  imageSrc,
  style,
  title = strings.formatString(strings.home.welcome, displayName.split(' ')[0]),
  text = strings.home.whats_new,
  loading = false,
  Right,
}) => (
  <View style={[styles.header, style]}>
    <View style={styles.greetings}>
      <View style={styles.headingWrapper}>
        <Typography text={title} type={types.headline2} />
        <ActivityIndicator color={colors.primary} style={styles.loading} animating={loading} />
      </View>
      {text.length > 0 && <Typography text={text} type={types.subheading} />}
    </View>
    {Right && <Right />}
    <Avatar src={imageSrc} text={displayName} />
  </View>
)

export default Header
