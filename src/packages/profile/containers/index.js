import React, { useCallback } from 'react'
import {
  View, Image, TouchableOpacity, ScrollView,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Text from 'Kebetoo/src/shared/components/text'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

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
      <Image style={styles.photo} source={{ uri: photoURL }} />
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

export const IconButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.iconButton} onPress={onPress}>
    <View style={styles.iconWrapper}>
      <Ionicon style={styles.icon} name={icon} size={20} color={colors.white} />
    </View>
    <Text text={text} />
  </TouchableOpacity>
)

const ProfilePage = () => {
  const profile = auth().currentUser

  const signOut = useCallback(() => {
    auth().signOut()
  }, [])

  const Stats = () => (
    <View style={styles.stats}>
      <Stat value={100} title="upvotes" />
      <Stat value={987} title="downvotes" />
      <Stat value={900} title="comments" />
    </View>
  )

  const ProfileSection = () => (
    <View style={styles.section}>
      <IconButton icon="ios-at" text="Edit username" />
      <IconButton icon="md-create" text="Edit profile" />
    </View>
  )

  const AccountSection = () => (
    <View style={styles.section}>
      <SectionTitle text="Account" />
      <IconButton icon="ios-log-out" text="Sign out" onPress={signOut} />
    </View>
  )

  const PreferencesSection = () => (
    <View style={styles.section}>
      <SectionTitle text="Preferences" />
      <IconButton icon="ios-color-palette" text="Dark Mode" />
      <IconButton icon="ios-notifications" text="Notifications" />
    </View>
  )

  const Header = () => (
    <View style={styles.header}>
      <Summary
        photoURL={profile.photoURL}
        displayName={profile.displayName}
        email={profile.email}
      />
      <Stats />
    </View>
  )

  return (
    <ScrollView style={styles.wrapper}>
      <Header profile={profile} />
      <ProfileSection />
      <PreferencesSection />
      <AccountSection />
    </ScrollView>
  )
}
export default ProfilePage
