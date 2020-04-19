import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth'

import Header from '../components/header'

import styles from './styles'

export const routeOptions = { title: 'Home' }

export default () => {
  const user = auth().currentUser
  const displayName = user.displayName || useSelector((state) => state.userReducer.displayName)

  return (
    <View style={styles.wrapper}>
      <Header displayName={displayName} imageSrc={user.photoURL} />
    </View>
  )
}
