import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react'
import {
  View, FlatList, RefreshControl, AppState, Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'

import * as types from 'Kebetoo/src/redux/types'
import BasicPost from 'Kebetoo/src/features/post/containers/basic-post'
import colors from 'Kebetoo/src/theme/colors'
import { postsSelector, displayNameSelector } from 'Kebetoo/src/redux/selectors'
import strings from 'Kebetoo/src/config/strings'
import RealPathUtils from 'Kebetoo/src/shared/helpers/native-modules/real-path'
import routes from 'Kebetoo/src/navigation/routes'
import RNFetchBlob from 'rn-fetch-blob'
import { getFileName } from 'Kebetoo/src/shared/helpers/file'
import usePosts from 'Kebetoo/src/shared/hooks/posts'
import useUser from 'Kebetoo/src/shared/hooks/user'

import Header from '../components/header'
import styles from './styles'

const routeOptions = { title: strings.tabs.home }

const getSharedFile = () => new Promise((resolve, reject) => {
  ReceiveSharingIntent.getReceivedFiles(resolve, reject)
  ReceiveSharingIntent.clearReceivedFiles()
})

const HomePage = () => {
  const dispatch = useDispatch()
  const posts = useSelector(postsSelector) || []
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [authors, setAuthors] = useState({})

  const { profile } = useUser()
  const savedDisplayName = useSelector(displayNameSelector)
  const { getRepostAuthors } = usePosts()

  const { navigate } = useNavigation()

  const handleSharingIntent = useCallback(async () => {
    try {
      const files = await getSharedFile()
      const sharedFile = files[0]
      let sharedFileContentUri = sharedFile.contentUri
      if (sharedFileContentUri) {
        if (Platform.OS === 'android') {
          const file = await RealPathUtils.getOriginalFilePath(sharedFileContentUri)
          const filename = getFileName(file)
          const dest = `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`
          await RNFetchBlob.fs.cp(file, dest)
          sharedFileContentUri = dest
        }
        navigate(routes.CREATE_POST, { sharedFile: sharedFileContentUri })
      } else {
        navigate(routes.CREATE_POST, {
          sharedText: sharedFile.text || sharedFile.weblink || '',
        })
      }
    } catch (error) {
      console.log('An error occured', error)
    }
  }, [navigate])

  useEffect(() => {
    handleSharingIntent()
    AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        handleSharingIntent()
      }
    })
  }, [handleSharingIntent])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(0)
  }, [])

  const onEndReached = useCallback(() => {
    setPage((value) => value + 1)
  }, [])

  useEffect(() => {
    dispatch({ type: types.API_FETCH_POSTS, payload: page })
  }, [dispatch, page, refreshing])

  useEffect(() => {
    if (page === 0) {
      if (refreshing) setRefreshing(false)
    }
  }, [page, refreshing])

  useEffect(() => {
    const fetchRepostAuthors = async () => {
      const data = await getRepostAuthors(posts)
      setAuthors(data)
    }
    fetchRepostAuthors()
  }, [posts, getRepostAuthors])

  const createKey = useCallback((item, index) => `basic-post-${item.id}-${index}`, [])

  const renderBasicPost = useCallback(({ item }) => (
    <BasicPost
      post={item}
      author={item.author}
      originalAuthor={
        item.repost
          ? authors[item.repost.author]
          : item.author
      }
    />
  ), [authors])

  const renderListHeader = useCallback(() => (
    <Header
      displayName={savedDisplayName || profile.displayName}
      imageSrc={profile.photoURL}
      style={styles.header}
    />
  ), [profile, savedDisplayName])

  const renderRefreshControl = useMemo(() => (
    <RefreshControl
      progressBackgroundColor={colors.backgroundSecondary}
      colors={[colors.primary]}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  ), [onRefresh, refreshing])

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={posts}
        contentContainerStyle={styles.flatlistContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        keyExtractor={createKey}
        ListHeaderComponent={renderListHeader}
        refreshControl={renderRefreshControl}
        renderItem={renderBasicPost}
        removeClippedSubviews
      />
    </View>
  )
}

HomePage.routeOptions = routeOptions

export default HomePage
