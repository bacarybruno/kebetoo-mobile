import React from 'react'
import { View } from 'react-native'
import auth from '@react-native-firebase/auth'

import Header from '../components/header'

import styles from './styles'

export const routeOptions = { title: 'Home' }

export default () => {
  const user = auth().currentUser
  const username = user.displayName.split(' ')[0]

  return (
    <View style={styles.wrapper}>
      <Header username={username} imageSrc={user.photoURL} />
    </View>
  )
}
