import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react'
import {
  View, FlatList, RefreshControl, AppState, Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import RNFetchBlob from 'rn-fetch-blob'

import * as types from '@app/redux/types'
import { postsSelector } from '@app/redux/selectors'
import BasicPost from '@app/features/post/containers/basic-post'
import { getFileName, getMimeType, getExtension } from '@app/shared/helpers/file'
import { useAnalytics, usePosts, useUser } from '@app/shared/hooks'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'
import { colors } from '@app/theme'
import RealPathUtils from '@app/shared/helpers/native-modules/real-path'

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
  const { trackReceiveIntent, reportError } = useAnalytics()

  const { profile } = useUser()
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
        trackReceiveIntent(getMimeType(sharedFileContentUri), getExtension(sharedFileContentUri))
        navigate(routes.CREATE_POST, { sharedFile: sharedFileContentUri })
      } else {
        navigate(routes.CREATE_POST, {
          sharedText: sharedFile.text || sharedFile.weblink || '',
        })
        trackReceiveIntent(sharedFile.weblink ? 'weblink' : 'text', sharedFile.weblink)
      }
    } catch (error) {
      reportError(error)
    }
  }, [navigate, trackReceiveIntent, reportError])

  useEffect(() => {
    handleSharingIntent()
    AppState.addEventListener('focus', handleSharingIntent)
    return () => {
      AppState.removeEventListener('focus', handleSharingIntent)
    }
  }, [handleSharingIntent])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(0)
  }, [])

  const onEndReached = useCallback(() => {
    setPage((value) => value + 1)
  }, [])

  useEffect(() => {
    if (page > 0) {
      dispatch({ type: types.API_FETCH_POSTS, payload: page })
    }
  }, [dispatch, page])

  useEffect(() => {
    if (page === 0) {
      if (refreshing) setRefreshing(false)
      dispatch({ type: types.API_FETCH_POSTS, payload: 0 })
    }
  }, [dispatch, page, refreshing])

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
      displayName={profile.displayName}
      imageSrc={profile.photoURL}
      style={styles.header}
    />
  ), [profile])

  const renderRefreshControl = useMemo(() => (
    <RefreshControl
      progressBackgroundColor={colors.background}
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
