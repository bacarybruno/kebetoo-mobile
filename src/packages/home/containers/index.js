import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth'

import Header from '../components/header'

import styles from './styles'

export const routeOptions = { title: 'Home' }

const HomePage = () => {
  const user = auth().currentUser
  const savedDisplayName = useSelector((state) => state.userReducer.displayName)
  const displayName = user.displayName || savedDisplayName

  return (
    <View style={styles.wrapper}>
      <Header displayName={displayName} imageSrc={user.photoURL} />
    </View>
  )
}

export default HomePage
