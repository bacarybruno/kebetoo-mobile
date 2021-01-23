import React, { useCallback, useState } from 'react'
import {
  View, ScrollView, Platform, Share, TouchableOpacity, Linking,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useActionSheet } from '@expo/react-native-action-sheet'
import DeviceInfo from 'react-native-device-info'

import {
  Pressable, Typography, Avatar, AppHeader,
} from '@app/shared/components'
import routes from '@app/navigation/routes'
import { api } from '@app/shared/services'
import * as types from '@app/redux/types'
import { appSelector, userStatsSelector } from '@app/redux/selectors'
import { strings } from '@app/config'
import {
  useAnalytics, useAppColors, useAppStyles, useUser,
} from '@app/shared/hooks'
import { rgbaToHex } from '@app/theme/colors'
import { actionTypes } from '@app/features/post/containers/create'
import { abbreviateNumber } from '@app/shared/helpers/strings'
import { warnNotImplemented } from '@app/shared/components/no-content'

import createThemedStyles, { imageSize } from './styles'

const routeOptions = { title: strings.tabs.profile }

export const SectionTitle = React.memo(({ text }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <Typography
      text={text}
      systemWeight={Typography.weights.bold}
      style={styles.sectionTitle}
      type={Typography.types.headline5}
      systemColor={Typography.colors.tertiary}
    />
  )
})

export const Summary = React.memo(({ photoURL, info, displayName }) => {
  const { navigate } = useNavigation()
  const styles = useAppStyles(createThemedStyles)

  const onPress = useCallback(() => {
    if (photoURL) {
      navigate(routes.MODAL_IMAGE, {
        source: {
          uri: photoURL,
        },
      })
    }
  }, [navigate, photoURL])

  return (
    <View style={styles.summary}>
      <TouchableOpacity
        style={styles.imageWrapper}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Avatar src={photoURL} text={displayName} size={imageSize} fontSize={48} />
      </TouchableOpacity>
      <View style={styles.summaryText}>
        <Typography type={Typography.types.headline1} text={displayName} />
        <Typography
          type={Typography.types.subheading}
          systemColor={Typography.colors.secondary}
          text={info}
        />
      </View>
    </View>
  )
})

export const Stat = React.memo(({ title, value }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.stat}>
      <Typography
        type={Typography.types.subheading}
        text={abbreviateNumber(value)}
        systemWeight={Typography.weights.bold}
        color="primary"
      />
      <Typography
        type={Typography.types.headline5}
        text={title}
        systemColor={Typography.colors.tertiary}
      />
    </View>
  )
})

export const IconButton = React.memo(({
  icon, text, message, onPress, children, ...otherProps
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  return (
    <View style={styles.iconButtonWrapper}>
      <Pressable style={styles.iconButton} onPress={onPress} {...otherProps}>
        <View style={styles.iconWrapper}>
          <Ionicon style={styles.icon} name={icon} size={20} color={colors.blue_dark} />
        </View>
        <View>
          <Typography
            type={Typography.types.headline5}
            text={text}
            style={styles.iconButtonTitle}
          />
          <Typography
            type={Typography.types.headline5}
            text={message}
            systemColor={Typography.colors.tertiary}
          />
        </View>
      </Pressable>
      {children}
    </View>
  )
})

export const Stats = React.memo(({
  postsCount, reactionsCount, commentsCount, style,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={[styles.stats, style]}>
      <Stat value={postsCount} title={strings.profile.posts.toLowerCase()} />
      <Stat value={commentsCount} title={strings.profile.comments.toLowerCase()} />
      <Stat value={reactionsCount} title={strings.profile.reactions.toLowerCase()} />
    </View>
  )
})

const ProfileSection = React.memo(({ managePosts }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.section}>
      <IconButton
        icon="md-list"
        text={strings.profile.manage_posts_title}
        message={strings.profile.manage_posts_desc}
        onPress={managePosts}
      />
    </View>
  )
})

const AccountSection = React.memo(({ signOut }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.section}>
      <SectionTitle text={strings.profile.account} />
      <IconButton
        icon="ios-at"
        text={strings.profile.edit_username}
        message={strings.profile.no_username_defined}
        onPress={warnNotImplemented}
      />
      <IconButton
        icon="md-create"
        text={strings.profile.edit_profile}
        onPress={warnNotImplemented}
      />
      <IconButton
        icon="ios-log-out"
        text={strings.profile.signout}
        onPress={signOut}
      />
    </View>
  )
})

const PreferencesSection = React.memo(({ updateAppearance }) => {
  const styles = useAppStyles(createThemedStyles)
  const { theme } = useSelector(appSelector)

  const getAppearanceMessage = useCallback(() => {
    switch (theme) {
      case 'dark':
        return strings.general.on
      case 'light':
        return strings.general.off
      case 'system':
        return strings.general.system_default
      default:
        return null
    }
  }, [theme])

  return (
    <View style={styles.section}>
      <SectionTitle text={strings.profile.preferences} />
      <IconButton
        onPress={updateAppearance}
        icon="ios-color-palette"
        text={strings.profile.dark_mode}
        message={getAppearanceMessage()}
      />
      <IconButton
        icon="ios-notifications"
        text={strings.profile.notifications}
        message={strings.general.on}
        onPress={warnNotImplemented}
      />
      <IconButton
        icon="language"
        text={strings.profile.language}
        message={strings.languages[strings.getLanguage()]}
        onPress={warnNotImplemented}
      />
    </View>
  )
})

const AppInfosSection = React.memo(({
  name, version, shareApp, reportIssue,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.section}>
      <SectionTitle text={strings.profile.application} />
      <IconButton
        icon={Platform.select({ ios: 'ios-happy', android: 'md-happy' })}
        text={strings.profile.invite_fiend_title}
        onPress={shareApp}
      />
      <IconButton
        icon="ios-warning"
        text={strings.general.support}
        onPress={reportIssue}
        message={strings.profile.issue_or_feedback}
      />
      <IconButton
        icon="information-circle-sharp"
        text={`${name} v${version}`}
        onPress={() => Linking.openURL(strings.auth.tos_url)}
        message={strings.auth.terms_and_conditions}
      />
    </View>
  )
})

export const ProfileHeader = React.memo(({
  profile, postsCount, reactionsCount, commentsCount,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.header}>
      <Summary
        photoURL={profile.photoURL}
        displayName={profile.displayName}
        info={profile.email}
      />
      <Stats
        postsCount={postsCount}
        reactionsCount={reactionsCount}
        commentsCount={commentsCount}
      />
    </View>
  )
})

const ProfilePage = React.memo(() => {
  const { profile, signOut } = useUser()
  const { navigate } = useNavigation()

  const stats = useSelector(userStatsSelector)
  const [postsCount, setPostsCount] = useState(stats.posts)
  const [commentsCount, setCommentsCount] = useState(stats.comments)
  const [reactionsCount, setReactionsCount] = useState(stats.reactions)

  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const { showActionSheetWithOptions } = useActionSheet()

  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        // fetch latest stats
        const userId = profile.uid
        if (userId) {
          const [posts, comments, reactions] = await Promise.all([
            api.posts.countByAuthor(userId),
            api.comments.countByAuthor(userId),
            api.reactions.countByAuthor(userId),
          ])

          // update data in component
          setPostsCount(posts)
          setCommentsCount(comments)
          setReactionsCount(reactions)

          // store the data in redux
          dispatch({
            type: types.SET_USER_STATS,
            payload: { posts, comments, reactions },
          })
        }
      }
      fetchStats()
    }, [dispatch, profile.uid]),
  )

  const shareApp = useCallback(() => {
    Share.share({
      title: strings.profile.share_title,
      url: strings.profile.share_url,
      message: `${strings.profile.share_message} - ${strings.profile.share_url}`,
    })
  }, [])

  const updateAppearance = useCallback(() => {
    const bottomSheetItems = [{
      title: strings.general.system_default,
    }, {
      title: strings.profile.dark,
    }, {
      title: strings.profile.light,
    }, {
      title: strings.general.cancel,
    }]

    showActionSheetWithOptions({
      options: bottomSheetItems.map((item) => item.title),
      cancelButtonIndex: bottomSheetItems.length - 1,
      title: strings.general.options,
      textStyle: { color: colors.textPrimary },
      titleTextStyle: { color: colors.textSecondary },
      containerStyle: { backgroundColor: rgbaToHex(colors.backgroundSecondary) },
    }, (index) => {
      if (index === 0) {
        dispatch({ type: types.SET_THEME, payload: 'system' })
      } else if (index === 1) {
        dispatch({ type: types.SET_THEME, payload: 'dark' })
      } else if (index === 2) {
        dispatch({ type: types.SET_THEME, payload: 'light' })
      }
    })
  }, [colors, dispatch, showActionSheetWithOptions])

  const managePosts = useCallback(() => navigate(routes.MANAGE_POSTS), [navigate])

  const reportIssue = useCallback(() => {
    navigate(routes.CREATE_POST, { action: actionTypes.REPORT })
  }, [navigate])

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.padding}>
          <AppHeader title={strings.tabs.profile} text="" showAvatar={false} />
          <ProfileHeader
            profile={profile}
            postsCount={postsCount}
            reactionsCount={reactionsCount}
            commentsCount={commentsCount}
          />
        </View>
        <ProfileSection managePosts={managePosts} />
        <PreferencesSection updateAppearance={updateAppearance} />
        <AppInfosSection
          name={DeviceInfo.getApplicationName()}
          version={DeviceInfo.getVersion()}
          shareApp={shareApp}
          reportIssue={reportIssue}
        />
        <AccountSection signOut={signOut} />
      </ScrollView>
    </View>
  )
})

ProfilePage.routeOptions = routeOptions

export default ProfilePage
