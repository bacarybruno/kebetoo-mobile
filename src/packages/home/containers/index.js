import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react'
import { View, FlatList, RefreshControl, AppState } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import auth from '@react-native-firebase/auth'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'

import * as types from 'Kebetoo/src/redux/types'
import BasicPost from 'Kebetoo/src/packages/post/containers/basic-post'
import colors from 'Kebetoo/src/theme/colors'
import {
  postsSelector, authorsSelector, displayNameSelector,
} from 'Kebetoo/src/redux/selectors'
import strings from 'Kebetoo/src/config/strings'
import RealPathUtils from 'Kebetoo/src/shared/helpers/native-modules/real-path'
import routes from 'Kebetoo/src/navigation/routes'
import RNFetchBlob from 'rn-fetch-blob'
import { getFileName } from 'Kebetoo/src/shared/helpers/file'

import Header from '../components/header'
import styles from './styles'

const routeOptions = { title: strings.tabs.home }

const HomePage = () => {
  const dispatch = useDispatch()
  const normalizedPosts = useSelector(postsSelector)
  const [posts, setPosts] = useState([])
  const authors = useSelector(authorsSelector)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const user = auth().currentUser

  const savedDisplayName = useSelector(displayNameSelector)
  const displayName = user.displayName || savedDisplayName || ''

  const { addListener: addNavigationListener, navigate } = useNavigation()

  const handleSharingIntent = useCallback(() => {
    ReceiveSharingIntent.getReceivedFiles((files) => {
      console.log(files)
      // TODO: show loader, because it takes 4.5s on average
      // or find a better way to get original sakh
      ReceiveSharingIntent.clearReceivedFiles()
      RealPathUtils.getOriginalFilePath(files[0].contentUri)
        .then((file) => {
          const filename = getFileName(file)
          const dest = `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`
          RNFetchBlob.fs.cp(file, dest)
            .then(() => navigate(routes.CREATE_POST, { file: dest }))
            .catch(console.log)
        })
    }, () => { })
  }, [navigate])

  useEffect(() => {
    handleSharingIntent()
    AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        handleSharingIntent()
      }
    })
  }, [handleSharingIntent, navigate])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(0)
  }, [])

  const onEndReached = useCallback(() => {
    setPage((value) => value + 1)
  }, [])

  useEffect(() => {
    const unsusbcribeFocus = addNavigationListener('focus', () => {
      // FIXME: this is freezing the UI.
      // Keep this until web find a better refresh strategy
      onRefresh()
    })
    return unsusbcribeFocus
  }, [addNavigationListener, onRefresh])

  useEffect(() => {
    dispatch({ type: types.API_FETCH_POSTS, payload: page })
  }, [dispatch, page, refreshing])

  useEffect(() => {
    if (page === 0) {
      setPosts(Object.values(normalizedPosts))
      if (refreshing) setRefreshing(false)
    }
  }, [normalizedPosts, page, refreshing])

  useEffect(() => {
    if (page > 0) {
      setPosts((value) => {
        const currentPostsIds = value.map((post) => post.id)
        const diff = Object
          .keys(normalizedPosts)
          .filter((postId) => currentPostsIds.indexOf(postId) === -1)

        if (diff.length === 0) return value

        const newPosts = diff.map((id) => normalizedPosts[id])
        return value.concat(newPosts)
      })
    }
  }, [normalizedPosts, page])

  const createKey = useCallback((item, index) => `basic-post-${item.id}-${index}`, [])

  const renderBasicPost = useCallback(({ item }) => (
    <BasicPost post={item} author={authors[item.author]} />
  ), [authors])

  const renderListHeader = useCallback(() => (
    <Header displayName={displayName} imageSrc={user.photoURL} style={styles.header} />
  ), [displayName, user.photoURL])

  const renderRefreshControl = useMemo(() => (
    <RefreshControl colors={[colors.primary]} refreshing={refreshing} onRefresh={onRefresh} />
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
