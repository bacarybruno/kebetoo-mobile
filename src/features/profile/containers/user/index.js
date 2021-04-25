import { useEffect, useState, useCallback } from 'react'
import { View, SectionList, Image, Text, ActivityIndicator } from 'react-native'
import dayjs from 'dayjs'

import { api } from '@app/shared/services'
import {
  Badge, Typography, Pressable, TextAvatar, AppHeader,
} from '@app/shared/components'
import BasicPost from '@app/features/post/containers/basic-post'
import { useAppColors, useAppStyles, usePosts } from '@app/shared/hooks'
import { metrics } from '@app/theme'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'

import { Stats } from '../index'
import createThemedStyles from './styles'

export const SectionHeader = ({ section, dateFormat }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={[styles.sectionHeader, styles.paddingHorizontal]}>
      <Typography
        type={Typography.types.subheading}
        systemWeight={Typography.weights.semibold}
        text={dayjs(section.title, dateFormat).format(strings.dates.format_month_year)}
      />
      <Badge text={`${section.data.length}+`} />
    </View>
  )
}

const isGoogleImageUrl = (url) => url && url.includes('googleusercontent.com')

const Bio = ({ text }) => {
  const styles = useAppStyles(createThemedStyles)
  if (!text) return null
  return (
    <View style={styles.bio}>
      <Typography
        text={strings.profile.bio}
        type={Typography.types.headline5}
        style={styles.about}
      />
      <Typography
        text={text}
        type={Typography.types.headline5}
        color={Typography.colors.tertiary}
      />
    </View>
  )
}

const UserProfile = ({ route, navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const { params: { userId } } = route
  const [posts, setPosts] = useState([])
  const [sortedPosts, setSortedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [authors, setAuthors] = useState({})
  const [next, setNext] = useState(null)
  const [user, setUser] = useState({
    displayName: ' ',
    photoURL: null,
    email: null,
    posts: [],
    comments: [],
    reactions: [],
    createdAt: dayjs().toISOString(),
    username: null,
    bio: null,
  })

  const dateFormat = 'YYYY-MM'

  const { getRepostAuthors } = usePosts()

  const photoURL = isGoogleImageUrl(user.photoURL) ? user.photoURL.replace('s96-c', 's400-c') : user.photoURL

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const [author, activities] = await Promise.all([
        api.authors.getById(userId),
        api.authors.getActivities(userId)
      ])
      setUser(author)
      setPosts(activities.items)
      setNext(activities.metadata?.next)
      setIsLoading(false)
    }

    fetchData()
  }, [userId])

  const loadMore = useCallback(async () => {
    setIsLoading(true)
    if (next) {
      const activities = await api.authors.getActivities(userId, next)
      setPosts((posts) => [...posts, ...activities.items])
      setNext(activities.metadata?.next)
    }
    setIsLoading(false)
  }, [next])

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
      const postsData = posts
        .flatMap((post) => post.data)
        .map((post) => ({
          repost: {
            author: post.repost?.author
              || post.author?._id
              || post.author,
          },
        }))
      const data = await getRepostAuthors(postsData)
      setAuthors(data)
    }
    fetchRepostAuthors()
  }, [posts, getRepostAuthors])

  const onListHeaderPress = useCallback(() => {
    if (photoURL) {
      navigation.navigate(routes.MODAL_IMAGE, {
        source: {
          uri: photoURL,
        },
      })
    }
  }, [navigation, photoURL])

  const keyExtractor = useCallback((item, index) => `section-item-${item.title}-${index}`, [])

  const renderSectionHeader = useCallback(({ section }) => (
    <SectionHeader section={section} dateFormat={dateFormat} />
  ), [])

  const renderItem = useCallback(({ item }) => {
    const { type, data } = item
    const post = data.post || data

    if (!post?.reactions) {
      // comments reactions or replies
      return null
    }

    let message = strings.user_profile.published_post
    if (type === 'post' && post.repost) message = strings.user_profile.shared_post
    else if (type === 'comment') message = strings.user_profile.commented_post
    else if (type === 'reaction') message = strings.user_profile.reacted_post

    return (
      <View style={styles.paddingHorizontal}>
        <View style={styles.subheading}>
          <Text>
            <Typography
              type={Typography.types.body}
              systemWeight={Typography.weights.bold}
              text={user.displayName}
            />
            <Typography
              type={Typography.types.body}
              text=" "
            />
            <Typography
              type={Typography.types.body}
              text={message}
            />
          </Text>
        </View>
        <BasicPost
          author={post.author}
          originalAuthor={
            post.repost
              ? authors[post.repost.author]
              : user
          }
          post={post}
        />
      </View>
    )
  }, [authors, styles.paddingHorizontal, user])

  const renderListHeader = useCallback(() => {
    const joinedAt = strings.formatString(
      strings.user_profile.joined_in,
      dayjs(user.createdAt).format(strings.dates.format_month_year),
    )
    return (
      <Pressable style={styles.listHeader} testID="list-header" onPress={onListHeaderPress}>
        <AppHeader headerBack style={styles.header} />
        {photoURL
          ? <Image source={{ uri: photoURL }} style={styles.listHeaderImage} />
          : <TextAvatar text={user.displayName} size={metrics.screenWidth} fontSize={150} noRadius />}
        <View style={styles.profileInfos}>
          <View style={styles.profileInfoSection}>
            <Typography
              style={styles.textCenter}
              type={Typography.types.headline2}
              text={user.displayName}
              systemWeight={Typography.weights.semibold}
              numberOfLines={1}
              adjustsFontSizeToFit
            />
            <Typography
              style={styles.textCenter}
              type={Typography.types.subheading}
              text={user.username || joinedAt}
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
        <Bio text={user.bio} />
      </Pressable>
    )
  }, [onListHeaderPress, photoURL, styles, user])

  return (
    <View style={styles.wrapper}>
      <SectionList
        sections={sortedPosts}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.sectionListContent}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={(
          <ActivityIndicator
            size="large"
            animating={isLoading}
            color={colors.primary}
          />
        )}
      />
    </View>
  )
}

export default UserProfile
