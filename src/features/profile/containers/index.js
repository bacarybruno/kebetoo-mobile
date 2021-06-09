import { memo, useCallback, useState } from 'react'
import {
  View, ScrollView, Platform, TouchableOpacity, Linking,
} from 'react-native'
import Share from 'react-native-share'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'
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
  useAppColors, useAppStyles, useBottomSheet, useUser,
} from '@app/shared/hooks'
import { actionTypes } from '@app/features/post/containers/create'
import { readableNumber } from '@app/shared/helpers/strings'
import { warnNotImplemented } from '@app/shared/components/no-content'
import useFilePicker from '@app/features/post/hooks/file-picker'

import createThemedStyles, { imageSize } from './styles'

const routeOptions = { title: strings.tabs.profile }

export const SectionTitle = memo(({ text }) => {
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

export const Summary = memo(({
  photoURL, info, displayName, onLoading,
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { navigate } = useNavigation()
  const { showAvatarOptions } = useUser()
  const { saveImage } = useFilePicker()

  const onAvatarOptions = useCallback(async () => {
    await showAvatarOptions({ onLoading, navigate, saveImage })
  }, [onLoading, navigate, saveImage, showAvatarOptions])

  return (
    <View style={styles.summary}>
      <TouchableOpacity
        style={styles.imageWrapper}
        activeOpacity={0.8}
        onPress={onAvatarOptions}
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

export const Stat = memo(({ title, value }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.stat}>
      <Typography
        type={Typography.types.subheading}
        text={readableNumber(value)}
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

export const IconButton = memo(({
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

export const Stats = memo(({
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

const ProfileSection = memo(({ managePosts }) => {
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

const AccountSection = memo(({
  signOut, editProfile, editUsername, username,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.section}>
      <SectionTitle text={strings.profile.account} />
      <IconButton
        icon="ios-at"
        text={strings.profile.edit_username}
        message={username || strings.profile.no_username_defined}
        onPress={editUsername}
      />
      <IconButton
        icon="md-create"
        text={strings.profile.edit_profile}
        onPress={editProfile}
      />
      <IconButton
        icon="ios-log-out"
        text={strings.profile.signout}
        onPress={signOut}
      />
    </View>
  )
})

const PreferencesSection = memo(({ updateAppearance, openLanguages }) => {
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
        onPress={openLanguages}
      />
    </View>
  )
})

const AppInfosSection = memo(({
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

export const ProfileHeader = memo(({
  profile, postsCount, reactionsCount, commentsCount, onLoading,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.header}>
      <Summary
        photoURL={profile.photoURL}
        displayName={profile.displayName}
        info={profile.bio || profile.email}
        onLoading={onLoading}
      />
      <Stats
        postsCount={postsCount}
        reactionsCount={reactionsCount}
        commentsCount={commentsCount}
      />
    </View>
  )
})

const ProfilePage = memo(() => {
  const { profile, signOut } = useUser()
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(false)

  const stats = useSelector(userStatsSelector)
  const [postsCount, setPostsCount] = useState(stats.posts)
  const [commentsCount, setCommentsCount] = useState(stats.comments)
  const [reactionsCount, setReactionsCount] = useState(stats.reactions)

  const styles = useAppStyles(createThemedStyles)

  const { showAppearanceOptions } = useBottomSheet()

  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        // fetch latest stats
        const userId = profile.uid
        if (userId) {
          const result = await api.authors.countActivities(userId)
          // update data in component
          setPostsCount(result.posts)
          setCommentsCount(result.comments)
          setReactionsCount(result.reactions)

          // store the data in redux
          dispatch({ type: types.SET_USER_STATS, payload: result })
        }
      }
      fetchStats()
    }, [dispatch, profile.uid]),
  )

  const shareApp = useCallback(() => {
    Share.open({
     title: strings.profile.share_title,
     url: strings.profile.share_url,
     message: `${strings.profile.share_message} - ${strings.profile.share_url}`,
    })
  }, [])

  const updateAppearance = useCallback(async () => {
    const actionIndex = await showAppearanceOptions()

    if (actionIndex === 0) {
      dispatch({ type: types.SET_THEME, payload: 'system' })
    } else if (actionIndex === 1) {
      dispatch({ type: types.SET_THEME, payload: 'dark' })
    } else if (actionIndex === 2) {
      dispatch({ type: types.SET_THEME, payload: 'light' })
    }
  }, [dispatch, showAppearanceOptions])

  const managePosts = useCallback(() => navigate(routes.MANAGE_POSTS), [navigate])

  const reportIssue = useCallback(() => {
    navigate(routes.CREATE_POST, { action: actionTypes.REPORT })
  }, [navigate])

  const editProfile = useCallback(() => {
    navigate(routes.EDIT_PROFILE)
  }, [navigate])

  const editUsername = useCallback(() => {
    navigate(routes.EDIT_PROFILE, { field: 'username' })
  }, [navigate])

  const openLanguages = useCallback(() => {
    navigate(routes.LANGUAGES)
  }, [navigate])

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.padding}>
          <AppHeader
            title={strings.tabs.profile}
            headerBack
            loading={loading}
          />
          <ProfileHeader
            profile={profile}
            postsCount={postsCount}
            reactionsCount={reactionsCount}
            commentsCount={commentsCount}
            onLoading={setLoading}
          />
        </View>
        <ProfileSection managePosts={managePosts} />
        <PreferencesSection
          updateAppearance={updateAppearance}
          openLanguages={openLanguages}
        />
        <AppInfosSection
          name={DeviceInfo.getApplicationName()}
          version={DeviceInfo.getVersion()}
          shareApp={shareApp}
          reportIssue={reportIssue}
        />
        <AccountSection
          signOut={signOut}
          editProfile={editProfile}
          editUsername={editUsername}
          username={profile.username}
        />
      </ScrollView>
    </View>
  )
})

ProfilePage.routeOptions = routeOptions

export default ProfilePage
