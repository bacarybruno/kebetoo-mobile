import React, { useCallback } from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Text from 'Kebetoo/src/shared/components/text'
import colors from 'Kebetoo/src/theme/colors'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import routes from 'Kebetoo/src/navigation/routes'

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
    <Text color="primary" bold text={value} />
    <Text color="blue_dark" size="sm" text={title} opacity={0.35} />
  </View>
)

export const IconButton = ({
  icon, text, message, onPress, children,
}) => (
    <View style={styles.iconButtonWrapper}>
      <TouchableOpacity style={styles.iconButton} onPress={onPress}>
        <View style={styles.iconWrapper}>
          <Ionicon style={styles.icon} name={icon} size={20} color={colors.primary} />
        </View>
        <View>
          <Text text={text} />
          {message && <Text text={message} size="sm" opacity={0.35} />}
        </View>
      </TouchableOpacity>
      {children}
    </View>
  )

const Stats = () => (
  <View style={styles.stats}>
    <Stat value={100} title="posts" />
    <Stat value={987} title="reactions" />
    <Stat value={900} title="comments" />
  </View>
)

const ProfileSection = ({ managePosts }) => (
  <View style={styles.section}>
    <IconButton
      icon="md-list"
      text="Manage posts"
      message="Edit or delete your posts"
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

const Header = ({ profile }) => (
  <View style={styles.header}>
    <Summary
      photoURL={profile.photoURL}
      displayName={profile.displayName}
      email={profile.email}
    />
    <Stats />
  </View>
)

const ProfilePage = () => {
  const profile = auth().currentUser
  const { navigate } = useNavigation()

  const signOut = useCallback(() => {
    auth().signOut()
  }, [])

  const managePosts = () => navigate(routes.MANAGE_POSTS)

  return (
    <View style={styles.wrapper}>
      <View style={styles.padding}>
        <Header profile={profile} />
      </View>
      <ScrollView style={styles.padding} contentContainerStyle={styles.scrollViewContent}>
        <ProfileSection managePosts={managePosts} />
        <PreferencesSection />
        <AccountSection signOut={signOut} />
      </ScrollView>
    </View>
  )
}
export default ProfilePage
