import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

import * as api from 'Kebetoo/src/shared/helpers/http'
import Typography, { types as typos } from 'Kebetoo/src/shared/components/typography'
import BasicPost from 'Kebetoo/src/packages/post/containers/basic-post'
import * as types from 'Kebetoo/src/redux/types'
import { recentSearchHistory } from 'Kebetoo/src/redux/selectors'
import Ionicon from 'react-native-vector-icons/Ionicons'
import colors from 'Kebetoo/src/theme/colors'
import strings from 'Kebetoo/src/config/strings'
import usePosts from 'Kebetoo/src/shared/hooks/posts'

import styles from './styles'
import HistoryItem from '../../components/history-item'
import NoResult from '../../components/no-result'

export const SearchHistoryHeader = ({ onClear }) => (
  <View style={[styles.historyHeader, styles.paddingHorizontal]}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicon name="md-time" size={18} style={{ marginRight: 8 }} color={colors.textPrimary} />
      <Typography
        type={typos.headline5}
        style={styles.sectionHeader}
        text={strings.search.recent_searches}
      />
    </View>
    <Typography
      type={typos.textButton}
      style={[styles.sectionHeader, styles.sectionHeaderLink]}
      onPress={onClear}
      text={strings.search.clear_all}
    />
  </View>
)

const SearchPosts = ({ searchQuery, onSearch, onRecentSearch }) => {
  const [posts, setPosts] = useState([])
  const [authors, setAuthors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { posts: postsHistory } = useSelector(recentSearchHistory)
  const dispatch = useDispatch()

  const { getRepostAuthors } = usePosts()

  const isFocused = useIsFocused()

  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length > 0 && isFocused) {
      setIsLoading(true)
      api.searchPosts(query)
        .then((data) => {
          setPosts(data)
          dispatch({ type: types.ADD_POST_HISTORY, payload: query })
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setPosts([])
    }
  }, [dispatch, onSearch, searchQuery, isFocused])

  useEffect(() => {
    onSearch(isLoading)
  }, [isLoading, onSearch])

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

  const renderSearchResultsHeader = useCallback(() => (
    <Typography
      type={typos.headline5}
      systemColor={colors.textTertiary}
      style={styles.sectionHeader}
      text={strings.search.results}
    />
  ), [])

  const onClearAllRecentSearches = useCallback(() => {
    dispatch({ type: types.CLEAR_POST_HISTORY })
  }, [dispatch])

  const onClearRecentSearch = useCallback((payload) => {
    dispatch({ type: types.REMOVE_POST_HISTORY, payload })
  }, [dispatch])

  const renderSearchHistoryHeader = useCallback(() => (
    <SearchHistoryHeader onClear={onClearAllRecentSearches} />
  ), [onClearAllRecentSearches])

  const renderSearchHistory = useCallback(({ item }) => (
    <HistoryItem onPress={onRecentSearch} onDelete={onClearRecentSearch} item={item} />
  ), [onClearRecentSearch, onRecentSearch])

  return (
    <View style={styles.wrapper}>
      {searchQuery.length === 0 && (
        <FlatList
          data={postsHistory}
          contentContainerStyle={styles.flatlistContent}
          keyExtractor={createKey}
          ListHeaderComponent={renderSearchHistoryHeader}
          renderItem={renderSearchHistory}
          removeClippedSubviews
        />
      )}
      {posts.length === 0 && searchQuery.length > 0 && !isLoading && (
        <NoResult query={searchQuery} />
      )}
      {posts.length > 0 && (
        <FlatList
          data={posts}
          contentContainerStyle={[styles.flatlistContent, styles.paddingHorizontal]}
          keyExtractor={createKey}
          ListHeaderComponent={renderSearchResultsHeader}
          renderItem={renderBasicPost}
          removeClippedSubviews
        />
      )}
    </View>
  )
}

export default SearchPosts
