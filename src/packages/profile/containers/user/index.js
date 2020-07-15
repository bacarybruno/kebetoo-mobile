import React, { useEffect, useState, useCallback } from 'react'
import { View, SectionList } from 'react-native'
import { useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'

import * as api from 'Kebetoo/src/shared/helpers/http'
import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import Badge from 'Kebetoo/src/shared/components/badge'
import BasicPost from 'Kebetoo/src/packages/post/containers/basic-post'
import usePosts from 'Kebetoo/src/shared/hooks/posts'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import colors from 'Kebetoo/src/theme/colors'
import { TransitionPresets } from '@react-navigation/stack'
import strings from 'Kebetoo/src/config/strings'

import { Summary, Stats } from '../index'
import styles from './styles'

export const routeOptions = {
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack tintColor={colors.textPrimary} />
  ),
  headerStyle: styles.header,
  headerTitleStyle: styles.headerTitle,
  title: strings.user_profile.profile,
  ...TransitionPresets.SlideFromRightIOS,
}

const UserProfile = ({ navigation }) => {
  navigation.setOptions(routeOptions)

  const { params: { userId } } = useRoute()
  const [posts, setPosts] = useState([])
  const [sortedPosts, setSortedPosts] = useState([])
  const [authors, setAuthors] = useState({})
  const [user, setUser] = useState({
    displayName: ' ',
    photoURL: null,
    email: null,
    posts: [],
    comments: [],
    reactions: [],
    createdAt: dayjs().toISOString(),
  })

  const dateFormat = 'YYYY-MM'

  const { getRepostAuthors } = usePosts()

  useEffect(() => {
    api.getAuthorById(userId).then(setUser).catch(console.log)
    api.getUserPosts(userId).then(setPosts).catch(console.log)
  }, [userId])

  useEffect(() => {
    const dateMap = {}
    posts.forEach((post) => {
      const date = dayjs(post.createdAt).format(dateFormat)
      if (!dateMap[date]) dateMap[date] = []
      dateMap[date].push(post)
    })
    const formattedPosts = Object.keys(dateMap).map((key) => ({
      title: key,
      data: dateMap[key],
    }))
    setSortedPosts(formattedPosts)
  }, [posts])

  useEffect(() => {
    const fetchRepostAuthors = async () => {
      const data = await getRepostAuthors(posts)
      setAuthors(data)
    }
    fetchRepostAuthors()
  }, [posts, getRepostAuthors])

  const keyExtractor = useCallback((item, index) => `section-item-${item.title}-${index}`, [])

  const renderSectionHeader = useCallback(({ section }) => {
    const outputDateFormat = 'MMMM YYYY'
    return (
      <View style={[styles.sectionHeader, styles.paddingHorizontal]}>
        <Typography
          type={types.headline3}
          text={dayjs(section.title, dateFormat).format(outputDateFormat)}
        />
        <Badge text={section.data.length} />
      </View>
    )
  }, [])

  const renderItem = useCallback(({ item }) => (
    <View style={styles.paddingHorizontal}>
      <BasicPost
        author={user}
        originalAuthor={
          item.repost
            ? authors[item.repost.author]
            : user
        }
        post={item}
      />
    </View>
  ), [authors, user])

  const renderListHeader = useCallback(() => (
    <>
      <View style={styles.userInfos}>
        <Summary
          displayName={user.displayName}
          photoURL={user.photoURL}
          info={`${strings.formatString(strings.user_profile.joined_in, dayjs(user.createdAt).format('MMMM YYYY'))}`}
        />
        <Stats
          postsCount={user.posts.length}
          commentsCount={user.comments.length}
          reactionsCount={user.reactions.length}
        />
      </View>
      <View style={styles.separator} />
    </>
  ), [user])

  return (
    <View style={styles.wrapper}>
      <SectionList
        sections={sortedPosts}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.sectionListContent}
        renderItem={renderItem}
      />
    </View>
  )
}

export default UserProfile
