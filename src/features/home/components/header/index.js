import React, { useCallback } from 'react'
import { View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Avatar from 'Kebetoo/src/shared/components/avatar'
import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import strings from 'Kebetoo/src/config/strings'
import colors from 'Kebetoo/src/theme/colors'
import routes from 'Kebetoo/src/navigation/routes'

import styles from './styles'

export const routeOptions = { headerShown: false }

const HeaderAvatar = ({ photoURL, displayName }) => {
  const { navigate } = useNavigation()

  const onPress = useCallback(() => {
    navigate(routes.PROFILE)
  }, [navigate])

  return (
    <TouchableOpacity onPress={onPress}>
      <Avatar src={photoURL} text={displayName} />
    </TouchableOpacity>
  )
}

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
    <HeaderAvatar displayName={displayName} photoURL={imageSrc} />
  </View>
)

export default Header
