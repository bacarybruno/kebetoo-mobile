/* eslint-disable import/default */
import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react'
import {
  View, FlatList, RefreshControl, Platform,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import ShareMenu from 'react-native-share-menu'
import RNFetchBlob from 'rn-fetch-blob'
import Snackbar from 'react-native-snackbar'

import * as types from '@app/redux/types'
import { postsSelector } from '@app/redux/selectors'
import BasicPost from '@app/features/post/containers/basic-post'
import { getFileName, getExtension } from '@app/shared/helpers/file'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'
import RealPathUtils from '@app/shared/helpers/native-modules/real-path'

import { AppHeader, SegmentedControl } from '@app/shared/components'
import { actionTypes } from '@app/features/post/containers/create'
import {
  useAnalytics, useAppColors, useAppStyles, useBottomSheet, usePosts, useUser,
} from '@app/shared/hooks'

import createThemedStyles from './styles'

const routeOptions = { title: strings.tabs.home }

// TODO: use local reducer
// or sagas
const HomePage = ({ navigation }) => {
  const dispatch = useDispatch()
  const posts = useSelector(postsSelector) || []
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [authors, setAuthors] = useState({})
  const { trackReceiveIntent } = useAnalytics()
  const { profile } = useUser()
  const { getRepostAuthors } = usePosts()
  const [postsSort, setPostsSort] = useState('score')

  const { colors } = useAppColors()
  const styles = useAppStyles(createThemedStyles)
  const { showFeedPostsOptions } = useBottomSheet()

  const handleShare = useCallback(async (item) => {
    if (!item?.data) return
    const { mimeType, data } = item
    if (mimeType.startsWith('text/')) {
      // text
      navigation.navigate(routes.CREATE_POST, { sharedText: data })
      trackReceiveIntent(mimeType, data)
    } else {
      // other assets: image, audio and video
      let sharedFile = data
      if (Platform.OS === 'android') {
        const file = await RealPathUtils.getOriginalFilePath(sharedFile)
        const filename = getFileName(file)
        const dest = `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`
        await RNFetchBlob.fs.cp(file, dest)
        sharedFile = dest
      }
      trackReceiveIntent(mimeType, getExtension(sharedFile))
      navigation.navigate(routes.CREATE_POST, { sharedFile })
    }
  }, [navigation, trackReceiveIntent])

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare)
    const listener = ShareMenu.addNewShareListener(handleShare)
    return () => {
      if (listener.remove) listener.remove()
    }
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(0)
  }, [])

  const onEndReached = useCallback(() => {
    setPage((value) => value + 1)
  }, [])

  useEffect(() => {
    if (page > 0) {
      dispatch({ type: types.API_FETCH_POSTS, payload: { page, sort: postsSort } })
    }
  }, [dispatch, page, postsSort])

  useEffect(() => {
    if (page === 0) {
      if (refreshing) setRefreshing(false)
      dispatch({ type: types.API_FETCH_POSTS, payload: { page: 0, sort: postsSort } })
    }
  }, [dispatch, page, postsSort, refreshing])

  useEffect(() => {
    const fetchRepostAuthors = async () => {
      const data = await getRepostAuthors(posts)
      setAuthors(data)
    }
    fetchRepostAuthors()
  }, [posts, getRepostAuthors])

  const createKey = useCallback((item, index) => `basic-post-${item.id}-${index}`, [])

  const hidePost = useCallback((post) => {
    dispatch({ type: types.HIDE_POST, payload: post })
    Snackbar.show({
      text: strings.home.hide_post_done,
      duration: Snackbar.LENGTH_SHORT,
    })
  }, [dispatch])

  const reportPost = useCallback((post) => {
    navigation.navigate(routes.CREATE_POST, {
      action: actionTypes.REPORT,
      sharedText: `[${post.id}]\n\n ${strings.home.report_post_message}`,
      onGoBack: () => hidePost(post),
    })
  }, [hidePost, navigation])

  const blockAuthor = useCallback((post) => {
    dispatch({ type: types.BLOCK_AUTHOR, payload: post })
    Snackbar.show({
      text: strings.formatString(strings.home.block_author_done, post.author.displayName.split(' ')[0]),
      duration: Snackbar.LENGTH_SHORT,
    })
  }, [dispatch])

  const showPostOptions = useCallback(async (post) => {
    if (post.author.id === profile.uid) {
      return navigation.navigate(routes.MANAGE_POSTS)
    }
    const actionIndex = await showFeedPostsOptions(post)
    if (actionIndex === 0) {
      hidePost(post)
    } else if (actionIndex === 1) {
      reportPost(post)
    } else if (actionIndex === 2) {
      blockAuthor(post)
    }
  }, [profile.uid, showFeedPostsOptions, hidePost, reportPost, blockAuthor, navigation])

  const renderBasicPost = useCallback(({ item }) => (
    <BasicPost
      post={item}
      author={item.author}
      onOptions={() => showPostOptions(item)}
      originalAuthor={
        item.repost
          ? authors[item.repost.author]
          : item.author
      }
    />
  ), [authors, showPostOptions])

  const onSelectFilter = useCallback((item) => {
    setPostsSort(item.value)
    setTimeout(onRefresh, 1)
  }, [onRefresh])

  const renderListHeader = useMemo(() => (user) => {
    const filterItems = [{
      label: strings.home.sort_trending,
      value: 'score',
    }, {
      label: strings.home.sort_recent,
      value: 'updatedAt',
    }]
    return (
      <View style={styles.headerWrapper}>
        <AppHeader
          displayName={user.displayName}
          imageSrc={user.photoURL}
          style={styles.header}
        />
        <SegmentedControl
          style={styles.header}
          items={filterItems}
          onSelect={onSelectFilter}
          selectedValue={postsSort}
        />
      </View>
    )
  }, [styles, onSelectFilter, postsSort])

  const renderRefreshControl = useMemo(() => (
    <RefreshControl
      progressBackgroundColor={colors.background}
      colors={[colors.primary]}
      tintColor={colors.primary}
      titleColor={colors.primary}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  ), [colors, onRefresh, refreshing])

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={posts}
        contentContainerStyle={styles.flatlistContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        keyExtractor={createKey}
        ListHeaderComponent={renderListHeader(profile)}
        refreshControl={renderRefreshControl}
        renderItem={renderBasicPost}
        removeClippedSubviews
      />
    </View>
  )
}

HomePage.routeOptions = routeOptions

export default HomePage
