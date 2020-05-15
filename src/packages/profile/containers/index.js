import React, { useCallback, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Text from 'Kebetoo/src/shared/components/text'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import colors from 'Kebetoo/src/theme/colors'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import routes from 'Kebetoo/src/navigation/routes'
import * as api from 'Kebetoo/src/shared/helpers/http'
import * as types from 'Kebetoo/src/redux/types'
import { userStatsSelector } from 'Kebetoo/src/redux/selectors'

import styles, { imageSize } from './styles'

export const routeOptions = { title: 'Profile' }

export const SectionTitle = ({ text }) => (
  <Text
    style={styles.sectionTitle}
    size="sm"
    color="blue_dark"
    opacity={0.35}
    text={text}
    bold
  />
)

export const Summary = ({ photoURL, email, displayName }) => (
  <View style={styles.summary}>
    <View style={styles.imageWrapper}>
      <Avatar src={photoURL} text={displayName} size={imageSize} fontSize={48} />
    </View>
    <View style={styles.summaryText}>
      <Text size="lg" color="blue_dark" text={displayName} />
      <Text size="md" color="blue_dark" text={email} />
    </View>
  </View>
)

export const Stat = ({ title, value }) => (
  <View style={styles.stat}>
    <Text color="blue_dark" bold text={value} />
    <Text color="blue_dark" size="sm" text={title} opacity={0.35} />
  </View>
)

export const IconButton = ({
  icon, text, message, onPress, children, ...otherProps
}) => (
  <View style={styles.iconButtonWrapper}>
    <Pressable style={styles.iconButton} onPress={onPress} {...otherProps}>
      <View style={styles.iconWrapper}>
        <Ionicon style={styles.icon} name={icon} size={20} color={colors.blue_dark} />
      </View>
      <View>
        <Text text={text} />
        {message && <Text text={message} size="sm" opacity={0.35} />}
      </View>
    </Pressable>
    {children}
  </View>
)

const Stats = ({ postsCount, reactionsCount, commentsCount }) => (
  <View style={styles.stats}>
    <Stat value={postsCount} title="posts" />
    <Stat value={reactionsCount} title="reactions" />
    <Stat value={commentsCount} title="comments" />
  </View>
)

const ProfileSection = ({ managePosts }) => (
  <View style={styles.section}>
    <IconButton
      icon="md-list"
      text="Manage posts"
      message="View, edit or delete your posts"
      onPress={managePosts}
    />
  </View>
)

const AccountSection = ({ signOut }) => (
  <View style={styles.section}>
    <SectionTitle text="Account" />
    <IconButton icon="ios-at" text="Edit username" message="No username defined" />
    <IconButton icon="md-create" text="Edit profile" />
    <IconButton icon="ios-log-out" text="Sign out" onPress={signOut} />
  </View>
)

const PreferencesSection = () => (
  <View style={styles.section}>
    <SectionTitle text="Preferences" />
    <IconButton icon="ios-color-palette" text="Dark Mode" />
    <IconButton icon="ios-notifications" text="Notifications" />
    <IconButton icon="ios-globe" text="Language" message="English" />
  </View>
)

const Header = ({
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
)

const ProfilePage = () => {
  const profile = auth().currentUser
  const { navigate } = useNavigation()

  const [postsCount, setPostsCount] = useState(0)
  const [reactionsCount, setReactionsCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)

  const stats = useSelector(userStatsSelector)
  const dispatch = useDispatch()

  const signOut = useCallback(() => {
    auth().signOut()
  }, [])

  useFocusEffect(
    useCallback(() => {
      api.getPostsCount(profile.uid)
        .then((posts) => {
          setPostsCount(posts)
          dispatch({ type: types.SET_USER_STATS, payload: { posts } })
        })
        .catch(() => {
          setPostsCount(stats.posts)
        })
      api.getCommentsCount(profile.uid)
        .then((comments) => {
          setCommentsCount(comments)
          dispatch({ type: types.SET_USER_STATS, payload: { comments } })
        })
        .catch(() => {
          setCommentsCount(stats.comments)
        })
      Promise.all([
        api.getLikesCount(profile.uid),
        api.getDislikesCount(profile.uid),
      ])
        .then((responses) => {
          const reactions = responses.reduce((a, b) => a + b)
          setReactionsCount(reactions)
          dispatch({ type: types.SET_USER_STATS, payload: { reactions } })
        })
        .catch(() => {
          setReactionsCount(stats.reactions)
        })
    }, [dispatch, profile.uid, stats.comments, stats.posts, stats.reactions]),
  )

  const managePosts = () => navigate(routes.MANAGE_POSTS)

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
        <PreferencesSection />
        <AccountSection signOut={signOut} />
      </ScrollView>
    </View>
  )
}
export default ProfilePage
