import React, { useCallback, useState } from 'react'
import { View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Popover from 'react-native-popover-view'

import { Avatar, Logo, Typography, IconButton } from '@app/shared/components'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'
import { useAppColors, useAppStyles, useNotifications, useUser } from '@app/shared/hooks'
import { actionTypes } from '@app/features/post/containers/create'

import createThemedStyles from './styles'
import { colors } from '@app/theme'

export const routeOptions = { headerShown: false }

const HeaderMenu = ({ close }) => {
  const { signOut } = useUser()
  const styles = useAppStyles(createThemedStyles)
  const { navigate } = useNavigation()
  const { badgeCount } = useNotifications()

  const navigateToRoute = (...args) => {
    navigate(...args)
    close()
  }

  const userSignOut = () => {
    signOut()
    close()
  }

  return (
    <View style={styles.headerMenu}>
      <IconButton.Text
        icon="ios-notifications-outline"
        text={strings.tabs.notifications}
        onPress={() => navigateToRoute(routes.NOTIFICATIONS)}
        badgeColor={colors.pink}
        badge={
          badgeCount > 0
            ? strings.formatString(strings.notifications.new_count, badgeCount)
            : null
        }
      />
      <IconButton.Text
        icon="md-list"
        text={strings.profile.manage_posts_title}
        onPress={() => navigateToRoute(routes.MANAGE_POSTS)}
      />
      <IconButton.Text
        icon="md-help"
        text={strings.profile.issue_or_feedback}
        onPress={() => navigateToRoute(routes.CREATE_POST, { action: actionTypes.REPORT })}
      />
      <IconButton.Text
        icon="ios-log-out"
        onPress={userSignOut}
        text={strings.profile.signout}
      />
    </View>
  )
}

export const HeaderAvatar = ({ photoURL, displayName, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  const [isVisible, setIsVisible] = useState(false)
  const { readableBadgeCount } = useNotifications()

  const open = () => setIsVisible(true)
  const close = () => setIsVisible(false)

  return (
    <Popover
      popoverStyle={styles.popover}
      onOpenComplete={open}
      onCloseComplete={close}
      onRequestClose={close}
      isVisible={isVisible}
      from={(
        <TouchableOpacity onPress={open}>
          <Avatar size={38} src={photoURL} text={displayName} badge={readableBadgeCount} />
        </TouchableOpacity>
      )}
    >
      <HeaderMenu close={close} />
    </Popover>
  )
}

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
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

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
