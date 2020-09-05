import React, { useEffect, useState, useCallback } from 'react'
import { View, SectionList, Image } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'

import * as api from 'Kebetoo/src/shared/helpers/http'
import Typography, { types, weights } from 'Kebetoo/src/shared/components/typography'
import Badge from 'Kebetoo/src/shared/components/badge'
import BasicPost from 'Kebetoo/src/packages/post/containers/basic-post'
import usePosts from 'Kebetoo/src/shared/hooks/posts'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import colors from 'Kebetoo/src/theme/colors'
import { TransitionPresets } from '@react-navigation/stack'
import strings from 'Kebetoo/src/config/strings'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import routes from 'Kebetoo/src/navigation/routes'

import { Stats } from '../index'
import styles from './styles'
import { TextAvatar } from 'Kebetoo/src/shared/components/avatar'
import metrics from 'Kebetoo/src/theme/metrics'

export const routeOptions = {
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack tintColor={colors.textPrimary} />
  ),
  headerStyle: styles.header,
  headerTitleStyle: styles.headerTitle,
  title: '',
  headerTransparent: true,
  ...TransitionPresets.SlideFromRightIOS,
}

const isGoogleImageUrl = (url) => url && url.includes('googleusercontent.com')

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
  const { navigate } = useNavigation()

  const photoURL = isGoogleImageUrl(user.photoURL) ? user.photoURL.replace('s96-c', 's400-c') : user.photoURL

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

  const onListHeaderPress = useCallback(() => {
    if (photoURL) {
      navigate(routes.MODAL_IMAGE, {
        source: {
          uri: photoURL,
        },
      })
    }
  }, [navigate, photoURL])

  const keyExtractor = useCallback((item, index) => `section-item-${item.title}-${index}`, [])

  const renderSectionHeader = useCallback(({ section }) => (
    <View style={[styles.sectionHeader, styles.paddingHorizontal]}>
      <Typography
        type={types.subheading}
        systemWeight={weights.semibold}
        text={dayjs(section.title, dateFormat).format(strings.dates.format_month_year)}
      />
      <Badge text={section.data.length} />
    </View>
  ), [])

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
    <Pressable style={styles.listHeader} onPress={onListHeaderPress}>
      {photoURL
        ? <Image source={{ uri: photoURL }} style={styles.listHeaderImage} />
        : <TextAvatar text={user.displayName} size={metrics.screenWidth} fontSize={150} noRadius />}
      <View style={styles.profileInfos}>
        <View style={styles.profileInfoSection}>
          <Typography
            style={styles.textCenter}
            type={types.headline2}
            text={user.displayName}
            systemWeight={weights.semibold}
          />
          <Typography
            style={styles.textCenter}
            type={types.subheading}
            text={strings.formatString(
              strings.user_profile.joined_in,
              dayjs(user.createdAt).format(strings.dates.format_month_year),
            )}
          />
        </View>
        <View style={styles.profileInfoSection}>
          <Stats
            postsCount={user.posts.length}
            commentsCount={user.comments.length}
            reactionsCount={user.reactions.length}
            style={styles.stats}
          />
        </View>
      </View>
    </Pressable>
  ), [onListHeaderPress, photoURL, user])

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
