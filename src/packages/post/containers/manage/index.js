import React, { memo, useEffect, useState, useCallback } from 'react'
import { View, SectionList } from 'react-native'
import auth from '@react-native-firebase/auth'
import moment from 'moment'

import * as api from 'Kebetoo/src/shared/helpers/http'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'
import BasicPost from '../basic-post'

export const routeOptions = {
  title: 'Manage posts',
  headerShown: true,
  headerBackImage: ({ tintColor }) => (
    <HeaderBack tintColor={tintColor} />
  ),
}

const ManagePostsPage = () => {
  const user = auth().currentUser
  const [posts, setPosts] = useState([])
  const [sortedPosts, setSortedPosts] = useState([])

  const dateFormat = 'YYYY-MM'

  useEffect(() => {
    const getPosts = async () => {
      const userPosts = await api.getUserPosts(user.uid)
      setPosts(userPosts)
    }
    getPosts()
  }, [])

  useEffect(() => {
    const dateMap = {}
    posts.forEach((post) => {
      const date = moment(post).format(dateFormat)
      if (!dateMap[date]) dateMap[date] = []
      dateMap[date].push(post)
    })
    const formattedPosts = Object.keys(dateMap).map((key) => ({
      title: key,
      data: dateMap[key]
    }))
    setSortedPosts(formattedPosts)
  }, [posts])

  const keyExtractor = useCallback((item, index) => `section-item-${item.title}-${index}`, [])

  const renderSectionHeader = useCallback(({ section }) => {
    const { title } = section
    const outputDateFormat = 'MMMM YYYY'
    return (
      <View style={styles.sectionHeader}>
        <Text size="header" text={moment(title, dateFormat).format(outputDateFormat)} />
      </View>
    )
  })

  const userToAuthor = ({ displayName, uid, photoURL }) => ({
    displayName,
    id: uid,
    photoURL,
  })

  const renderItem = useCallback(({ item }) => (
    <BasicPost author={userToAuthor(user)} post={item} />
  ))

  return (
    <View style={styles.wrapper}>
      <SectionList
        sections={sortedPosts}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
      />
    </View>
  )
}

export default memo(ManagePostsPage)