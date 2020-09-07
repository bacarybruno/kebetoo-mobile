import React, { useEffect, useState, useCallback } from 'react'
import {
  View, SectionList, Alert, YellowBox,
} from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import dayjs from 'dayjs'
import { useActionSheet } from '@expo/react-native-action-sheet'

import * as api from '@app/shared/helpers/http'
import HeaderBack from '@app/shared/components/header-back'
import Typography, { types, weights } from '@app/shared/components/typography'
import colors, { rgbaToHex } from '@app/theme/colors'
import routes from '@app/navigation/routes'
import NoContent from '@app/shared/components/no-content'
import ActionButton from 'react-native-action-button'
import Badge from '@app/shared/components/badge'
import strings from '@app/config/strings'
import usePosts from '@app/shared/hooks/posts'
import useUser from '@app/shared/hooks/user'

import styles from './styles'
import BasicPost from '../basic-post'
import { actionTypes } from '../create'

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
])

export const routeOptions = {
  title: strings.profile.manage_posts_title,
  headerShown: true,
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { color: colors.textPrimary },
  headerBackImage: () => (
    <HeaderBack tintColor={colors.textPrimary} />
  ),
}

export const NoPosts = () => (
  <NoContent title={strings.general.no_content} text={strings.manage_posts.no_content} />
)

const bottomSheetItems = [{
  title: strings.manage_posts.edit_post,
  icon: 'md-create',
}, {
  title: strings.manage_posts.delete_post,
  icon: 'ios-trash',
}, {
  title: strings.general.cancel,
  icon: 'md-close',
}]

const ManagePostsPage = ({ navigation }) => {
  navigation.setOptions(routeOptions)

  const { profile } = useUser()
  const [posts, setPosts] = useState([])
  const [authors, setAuthors] = useState({})
  const [sortedPosts, setSortedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const { getRepostAuthors } = usePosts()

  const { showActionSheetWithOptions } = useActionSheet()
  const { navigate } = navigation
  const dateFormat = 'YYYY-MM'

  useEffect(() => {
    const getPosts = async () => {
      if (profile.uid) {
        const userPosts = await api.getUserPosts(profile.uid)
        setPosts(userPosts)
        setLoading(false)
      }
    }
    getPosts()
  }, [profile.uid])

  useEffect(() => {
    const fetchRepostAuthors = async () => {
      const data = await getRepostAuthors(posts)
      setAuthors(data)
    }
    const formatPosts = () => {
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
    }
    formatPosts()
    fetchRepostAuthors()
  }, [posts, getRepostAuthors])

  const keyExtractor = useCallback((item, index) => `section-item-${item.title}-${index}`, [])

  const renderSectionHeader = useCallback(({ section }) => (
    <View style={styles.sectionHeader}>
      <Typography
        type={types.subheading}
        systemWeight={weights.semibold}
        text={dayjs(section.title, dateFormat).format(strings.dates.format_month_year)}
      />
      <Badge text={section.data.length} />
    </View>
  ), [])

  const onPostEdited = useCallback((editedPost) => {
    if (editedPost) {
      setPosts((value) => [
        editedPost,
        ...value.filter((v) => v.id !== editedPost.id),
      ])
    }
  }, [])

  const onPostCreated = useCallback((createdPost) => {
    if (createdPost) {
      setPosts((value) => [
        createdPost,
        ...value,
      ])
    }
  }, [])

  const confirmDeletePost = useCallback(async (id) => {
    if (id) {
      await api.deletePost(id)
      setPosts((value) => value.filter((v) => v.id !== id))
    }
  }, [])

  const editPost = useCallback((post) => {
    navigate(routes.CREATE_POST, {
      action: actionTypes.EDIT,
      payload: post,
      onGoBack: onPostEdited,
    })
  }, [navigate, onPostEdited])

  const deletePost = useCallback((post) => {
    Alert.alert(
      strings.manage_posts.delete_post_title,
      strings.manage_posts.delete_post_warning,
      [
        { text: strings.general.cancel, style: 'cancel' },
        { text: strings.general.confirm, style: 'destructive', onPress: () => confirmDeletePost(post.id) },
      ],
      { cancelable: false },
    )
  }, [confirmDeletePost])

  const showPostOptions = useCallback((post) => {
    const cancelButtonIndex = 2
    const destructiveButtonIndex = 1
    showActionSheetWithOptions({
      options: bottomSheetItems.map((item) => item.title),
      icons: bottomSheetItems.map((item, index) => (
        <Ionicon
          name={item.icon}
          size={24}
          color={index === destructiveButtonIndex ? colors.danger : colors.textPrimary}
        />
      )),
      cancelButtonIndex,
      destructiveButtonIndex,
      title: strings.general.actions,
      textStyle: { color: colors.textPrimary },
      titleTextStyle: { color: colors.textSecondary },
      containerStyle: { backgroundColor: rgbaToHex(colors.backgroundSecondary) },
    }, (index) => {
      if (index === 0) {
        editPost(post)
      } else if (index === 1) {
        deletePost(post)
      }
    })
  }, [deletePost, editPost, showActionSheetWithOptions])

  const userToAuthor = ({ displayName, uid, photoURL }) => ({
    displayName,
    id: uid,
    photoURL,
  })

  const renderItem = useCallback(({ item }) => (
    <BasicPost
      onOptions={() => showPostOptions(item)}
      author={userToAuthor(profile)}
      originalAuthor={
        item.repost
          ? authors[item.repost.author]
          : userToAuthor(profile)
      }
      post={item}
    />
  ), [authors, showPostOptions, profile])

  const renderNoPost = useCallback(() => loading === false && <NoPosts />, [loading])

  const createPost = useCallback(() => {
    navigate(routes.CREATE_POST, {
      onGoBack: onPostCreated,
    })
  }, [navigate, onPostCreated])

  return (
    <View style={[styles.wrapper, sortedPosts.length === 0 && { paddingTop: 0 }]}>
      <SectionList
        style={styles.sectionList}
        sections={sortedPosts}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderNoPost}
        contentContainerStyle={styles.sectionListContent}
        renderItem={renderItem}
      />
      <ActionButton
        buttonColor={colors.primary}
        onPress={createPost}
        buttonTextStyle={styles.fab}
        offsetX={16}
        offsetY={16}
        fixNativeFeedbackRadius
      />
    </View>
  )
}

export default React.memo(ManagePostsPage)
