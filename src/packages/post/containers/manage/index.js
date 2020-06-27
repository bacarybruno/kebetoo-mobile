import React, { useEffect, useState, useCallback } from 'react'
import {
  View, SectionList, Alert, YellowBox,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import Ionicon from 'react-native-vector-icons/Ionicons'
import dayjs from 'dayjs'
import { useActionSheet } from '@expo/react-native-action-sheet'

import * as api from 'Kebetoo/src/shared/helpers/http'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import Text from 'Kebetoo/src/shared/components/text'
import colors from 'Kebetoo/src/theme/colors'
import routes from 'Kebetoo/src/navigation/routes'
import NoContent from 'Kebetoo/src/shared/components/no-content'
import ActionButton from 'react-native-action-button'
import Badge from 'Kebetoo/src/shared/components/badge'
import strings from 'Kebetoo/src/config/strings'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'

import styles from './styles'
import BasicPost from '../basic-post'
import { actionTypes } from '../create'

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
])

export const routeOptions = {
  title: strings.profile.manage_posts_title,
  headerShown: true,
  headerBackImage: ({ tintColor }) => (
    <HeaderBack tintColor={tintColor} />
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

  const user = auth().currentUser
  const [posts, setPosts] = useState([])
  const [authors, setAuthors] = useState({})
  const [sortedPosts, setSortedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const { showActionSheetWithOptions } = useActionSheet()
  const { navigate } = navigation
  const dateFormat = 'YYYY-MM'

  useEffect(() => {
    const getPosts = async () => {
      const userPosts = await api.getUserPosts(user.uid)
      setPosts(userPosts)
      setLoading(false)
    }
    getPosts()
  }, [user.uid])

  useEffect(() => {
    const fetchAuthors = async () => {
      const data = {}
      const authorsToFetch = []
      for (let i = 0; i < posts.length; i += 1) {
        const post = posts[i]
        if (post.repost) {
          authorsToFetch.push(post.repost.author)
        }
      }
      if (authorsToFetch.length > 0) {
        const ids = [...new Set(authorsToFetch)]
        if (ids.length === 0) return
        const { docs } = await getUsers(ids)
        docs.forEach((doc) => {
          const { displayName: name, photoURL } = doc.data()
          data[doc.id] = {
            displayName: name,
            photoURL,
          }
        })
        setAuthors(data)
      }
    }
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
    fetchAuthors()
  }, [posts])

  const keyExtractor = useCallback((item, index) => `section-item-${item.title}-${index}`, [])

  const renderSectionHeader = useCallback(({ section }) => {
    const outputDateFormat = 'MMMM YYYY'
    return (
      <View style={styles.sectionHeader}>
        <Text size="header" text={dayjs(section.title, dateFormat).format(outputDateFormat)} />
        <Badge text={section.data.length} />
      </View>
    )
  }, [])

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
          style={index === destructiveButtonIndex && { color: colors.danger }}
        />
      )),
      cancelButtonIndex,
      destructiveButtonIndex,
      title: strings.general.actions,
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
      author={userToAuthor(user)}
      originalAuthor={
        item.repost
          ? authors[item.repost.author]
          : userToAuthor(user)
      }
      post={item}
    />
  ), [authors, showPostOptions, user])

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
