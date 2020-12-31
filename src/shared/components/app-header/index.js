import React, { useCallback } from 'react'
import { View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Avatar, Logo, Typography } from '@app/shared/components'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'
import { useAppColors } from '@app/shared/hooks'

import styles from './styles'

export const routeOptions = { headerShown: false }

export const HeaderAvatar = ({ photoURL, displayName, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Avatar src={photoURL} text={displayName} />
  </TouchableOpacity>
)

const Header = ({
  displayName = '',
  imageSrc,
  style,
  title = strings.formatString(strings.home.welcome, (
    displayName && displayName.trim()
      ? displayName.trim().split(' ')[0]
      : ''
  )),
  text = strings.home.whats_new,
  loading = false,
  showAvatar = true,
  Right,
}) => {
  const { navigate } = useNavigation()
  const colors = useAppColors()

  const onHeaderPress = useCallback(() => {
    navigate(routes.PROFILE)
  }, [navigate])

  return (
    <View style={[styles.header, style]}>
      <View style={styles.greetings}>
        <View style={styles.section}>
          <Typography text={title.replace(' ,', ',')} type={Typography.types.headline2} />
          <ActivityIndicator color={colors.primary} style={styles.loading} animating={loading} />
        </View>
        {text.length > 0 && (
          <View style={styles.section}>
            <Typography text={text} type={Typography.types.subheading} />
            <Logo style={styles.icon} />
          </View>
        )}
      </View>
      {Right && <Right />}
      {showAvatar && (
        <HeaderAvatar displayName={displayName} photoURL={imageSrc} onPress={onHeaderPress} />
      )}
    </View>
  )
}

export default Header
