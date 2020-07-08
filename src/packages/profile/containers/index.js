import React, { useCallback, useState } from 'react'
import {
  View, ScrollView, Platform, Share,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Typography, {
  types as typos, colors as systemColors, weights,
} from 'Kebetoo/src/shared/components/typography'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import colors from 'Kebetoo/src/theme/colors'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import routes from 'Kebetoo/src/navigation/routes'
import * as api from 'Kebetoo/src/shared/helpers/http'
import * as types from 'Kebetoo/src/redux/types'
import { userStatsSelector } from 'Kebetoo/src/redux/selectors'
import strings from 'Kebetoo/src/config/strings'

import styles, { imageSize } from './styles'

export const routeOptions = { title: strings.tabs.profile }

export const SectionTitle = React.memo(({ text }) => (
  <Typography
    text={text}
    systemWeight={weights.bold}
    style={styles.sectionTitle}
    type={typos.headline5}
    systemColor={systemColors.tertiary}
  />
))

export const Summary = React.memo(({ photoURL, email, displayName }) => (
  <View style={styles.summary}>
    <View style={styles.imageWrapper}>
      <Avatar src={photoURL} text={displayName} size={imageSize} fontSize={48} />
    </View>
    <View style={styles.summaryText}>
      <Typography type={typos.headline1} text={displayName} />
      <Typography type={typos.subheading} text={email} />
    </View>
  </View>
))

export const Stat = React.memo(({ title, value }) => (
  <View style={styles.stat}>
    <Typography type={typos.headline4} text={value} systemWeight={weights.bold} color="primary" />
    <Typography type={typos.headline6} text={title} systemColor={systemColors.tertiary} />
  </View>
))

export const IconButton = React.memo(({
  icon, text, message, onPress, children, ...otherProps
}) => (
  <View style={styles.iconButtonWrapper}>
    <Pressable style={styles.iconButton} onPress={onPress} {...otherProps}>
      <View style={styles.iconWrapper}>
        <Ionicon style={styles.icon} name={icon} size={20} color={colors.blue_dark} />
      </View>
      <View>
        <Typography type={typos.headline5} text={text} style={styles.iconButtonTitle} />
        <Typography type={typos.headline5} text={message} systemColor={systemColors.tertiary} />
      </View>
    </Pressable>
    {children}
  </View>
))

const Stats = React.memo(({ postsCount, reactionsCount, commentsCount }) => (
  <View style={styles.stats}>
    <Stat value={postsCount} title={strings.profile.posts.toLowerCase()} />
    <Stat value={reactionsCount} title={strings.profile.reactions.toLowerCase()} />
    <Stat value={commentsCount} title={strings.profile.comments.toLowerCase()} />
  </View>
))

const ProfileSection = React.memo(({ managePosts }) => (
  <View style={styles.section}>
    <IconButton
      icon="md-list"
      text={strings.profile.manage_posts_title}
      message={strings.profile.manage_posts_desc}
      onPress={managePosts}
    />
  </View>
))

const AccountSection = React.memo(({ signOut }) => (
  <View style={styles.section}>
    <SectionTitle text={strings.profile.account} />
    <IconButton
      icon="ios-at"
      text={strings.profile.edit_username}
      message={strings.profile.no_username_defined}
    />
    <IconButton
      icon="md-create"
      text={strings.profile.edit_profile}
    />
    <IconButton
      icon="ios-log-out"
      text={strings.profile.signout}
      onPress={signOut}
    />
  </View>
))

const PreferencesSection = React.memo(({ shareApp }) => (
  <View style={styles.section}>
    <SectionTitle text={strings.profile.preferences} />
    <IconButton
      icon={Platform.select({ ios: 'ios-happy', android: 'md-happy' })}
      text={strings.profile.invite_fiend_title}
      onPress={shareApp}
    />
    <IconButton
      disabled
      icon="ios-color-palette"
      text={strings.profile.dark_mode}
      message={strings.general.system_default}
    />
    <IconButton icon="ios-notifications" text={strings.profile.notifications} />
    <IconButton
      disabled
      icon="ios-globe"
      text={strings.profile.language}
      message={strings.languages[strings.getLanguage()]}
    />
  </View>
))

const Header = React.memo(({
  profile, postsCount, reactionsCount, commentsCount,
}) => (
  <View style={styles.header}>
    <Summary
      photoURL={profile.photoURL}
      displayName={profile.displayName}
      email={profile.email}
    />
    <Stats
      postsCount={postsCount}
      reactionsCount={reactionsCount}
      commentsCount={commentsCount}
    />
  </View>
))

const ProfilePage = React.memo(() => {
  const profile = auth().currentUser
  const { navigate } = useNavigation()

  const stats = useSelector(userStatsSelector)
  const [postsCount, setPostsCount] = useState(stats.posts)
  const [commentsCount, setCommentsCount] = useState(stats.comments)
  const [reactionsCount, setReactionsCount] = useState(stats.reactions)

  const dispatch = useDispatch()

  const signOut = useCallback(() => {
    auth().signOut()
  }, [])

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        // fetch latest stats
        const [posts, comments, reactions] = await Promise.all([
          api.getPostsCount(profile.uid),
          api.getCommentsCount(profile.uid),
          api.getReactionsCount(profile.uid),
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
      fetchStats()
    }, [dispatch, profile.uid]),
  )

  const shareApp = useCallback(() => {
    Share.share({
      title: strings.profile.share_title,
      url: strings.profile.share_url,
      message: strings.profile.share_message,
    })
  }, [])

  const managePosts = useCallback(() => navigate(routes.MANAGE_POSTS), [navigate])

  return (
    <View style={styles.wrapper}>
      <View style={styles.padding}>
        <Header
          profile={profile}
          postsCount={postsCount}
          reactionsCount={reactionsCount}
          commentsCount={commentsCount}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ProfileSection managePosts={managePosts} />
        <PreferencesSection shareApp={shareApp} />
        <AccountSection signOut={signOut} />
      </ScrollView>
    </View>
  )
})

ProfilePage.routeOptions = routeOptions

export default ProfilePage
