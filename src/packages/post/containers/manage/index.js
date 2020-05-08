import React, { memo, useEffect, useState, useCallback } from 'react'
import { View, SectionList, Alert, YellowBox } from 'react-native'
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { useActionSheet } from '@expo/react-native-action-sheet'

import * as api from 'Kebetoo/src/shared/helpers/http'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import Text from 'Kebetoo/src/shared/components/text'
import colors from 'Kebetoo/src/theme/colors'
import routes from 'Kebetoo/src/navigation/routes'
import NoContent from 'Kebetoo/src/shared/components/no-content'

import styles from './styles'
import BasicPost from '../basic-post'
import { actionTypes } from '../create'

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
])

export const routeOptions = {
  title: 'Manage posts',
  headerShown: true,
  headerBackImage: ({ tintColor }) => (
    <HeaderBack tintColor={tintColor} />
  ),
}

export const NoPosts = ({ onPress }) => (
  <NoContent title="No posts yet">
    <Text text="Take the leap and">
      <Text color="secondary" text=" create your first post" onPress={onPress} />
    </Text>
  </NoContent>
)

const ManagePostsPage = () => {
  const user = auth().currentUser
  const [posts, setPosts] = useState([])
  const [sortedPosts, setSortedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const { showActionSheetWithOptions } = useActionSheet()
  const { navigate } = useNavigation()
  const dateFormat = 'YYYY-MM'

  const bottomSheetItems = [{
    title: 'Edit post',
    icon: 'md-create'
  }, {
    title: 'Delete post',
    icon: 'ios-trash'
  }, {
    title: 'Cancel',
    icon: 'md-close'
  }]

  useEffect(() => {
    const getPosts = async () => {
      const userPosts = await api.getUserPosts(user.uid)
      setPosts(userPosts)
      setLoading(false)
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

  const onPostEdited = useCallback((editedPost) => {
    if (editedPost) {
      setPosts((value) => {
        return [
          editedPost,
          ...value.filter((v) => v.id !== editedPost.id),
        ]
      })
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
  }, [])

  const deletePost = useCallback((post) => {
    Alert.alert(
      'Delete this post?',
      'This post will be permanently deleted. You will not be able to restore it later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: () => confirmDeletePost(post.id) },
      ],
      { cancelable: false },
    )
  }, [])

  const showPostOptions = useCallback((post) => {
    const cancelButtonIndex = 2
    const destructiveButtonIndex = 1
    showActionSheetWithOptions({
      options: bottomSheetItems.map((item) => item.title),
      icons: bottomSheetItems.map((item, index) => (
        <Ionicon
          name={item.icon}
          size={24}
          style={index === destructiveButtonIndex && { color: colors.danger }}
        />
      )),
      cancelButtonIndex,
      destructiveButtonIndex,
      title: 'Actions',
    }, (index) => {
      if (index === 0) {
        editPost(post)
      } else if (index === 1) {
        deletePost(post)
      }
    })
  }, [])

  const userToAuthor = ({ displayName, uid, photoURL }) => ({
    displayName,
    id: uid,
    photoURL,
  })

  const renderItem = useCallback(({ item }) => (
    <BasicPost
      onOptions={() => showPostOptions(item)}
      author={userToAuthor(user)}
      post={item}
      disabled
    />
  ), [])

  const renderNoPost = useCallback(() => !loading && (
    <NoPosts onPress={() => navigate(routes.CREATE_POST)} />
  ), [navigate, loading])

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
    </View>
  )
}

export default memo(ManagePostsPage)