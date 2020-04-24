import React, {
  useEffect, useState, useCallback, memo,
} from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import auth from '@react-native-firebase/auth'

import * as types from 'Kebetoo/src/redux/types'
import BasicPost from 'Kebetoo/src/packages/post/containers/basic-post'
import colors from 'Kebetoo/src/theme/colors'

import Header from '../components/header'
import styles from './styles'

export const routeOptions = { title: 'Home' }

const HomePage = () => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.postsReducer.posts)
  const authors = useSelector((state) => state.postsReducer.authors)
  const refreshing = useSelector((state) => state.postsReducer.refreshing)

  const [page, setPage] = useState(0)

  const user = auth().currentUser
  const savedDisplayName = useSelector((state) => state.userReducer.displayName)
  const displayName = user.displayName || savedDisplayName

  useEffect(() => {
    dispatch({ type: types.API_FETCH_POSTS, payload: page })
  }, [dispatch, page])

  const onRefresh = useCallback(() => {
    dispatch({ type: types.API_REFRESH_POSTS })
    setPage(0)
  }, [dispatch])

  const onEndReached = useCallback(() => {
    setPage((value) => value + 1)
  }, [])

  const createKey = (item, index) => `basic-post-${item.id}-${index}`

  const renderBasicPost = useCallback(({ item }) => (
    <BasicPost
      post={item}
      author={authors[item.author]}
    />
  ), [authors])

  const renderListHeader = useCallback(() => (
    <Header
      displayName={displayName}
      imageSrc={user.photoURL}
      style={styles.header}
    />
  ), [displayName, user])

  const renderRefreshControl = (
    <RefreshControl
      colors={[colors.primary]}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  )

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

export default memo(HomePage)
