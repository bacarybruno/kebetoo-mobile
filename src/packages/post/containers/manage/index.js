import React, { memo, useEffect, useState } from 'react'
import { View } from 'react-native'
import auth from '@react-native-firebase/auth'

import * as api from 'Kebetoo/src/shared/helpers/http'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'

import styles from './styles'

export const routeOptions = {
  title: 'Manage posts',
  headerShown: true,
  headerBackImage: ({ tintColor }) => (
    <HeaderBack tintColor={tintColor} />
  ),
}

const ManagePostsPage = () => {
  const { uid } = auth().currentUser
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getPosts = async () => {
      const userPosts = await api.getUserPosts(uid)
      setPosts(userPosts)
    }
    getPosts()
  })

  return (
    <View style={styles.wrapper}></View>
  )
}

export default memo(ManagePostsPage)