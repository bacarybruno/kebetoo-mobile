import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import * as api from '@app/shared/services/http'
import { Typography, Avatar, Pressable } from '@app/shared/components'
import * as types from '@app/redux/types'
import { recentSearchHistory } from '@app/redux/selectors'
import { colors } from '@app/theme'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'

import styles from './styles'
import HistoryItem from '../../components/history-item'
import NoResult from '../../components/no-result'

export const SearchResult = ({ item, onPress }) => (
  <Pressable style={[styles.searchResult, styles.paddingHorizontal]} onPress={() => onPress(item)}>
    <View style={styles.row}>
      <Avatar
        src={item.photoURL}
        text={item.displayName}
        size={40}
        fontSize={24}
        style={styles.avatar}
      />
      <View style={styles.metadata}>
        <Typography text={item.displayName} type={Typography.types.subheading} />
        <View style={styles.row}>
          <Typography
            type={Typography.types.headline5}
            text={`${item.posts.length} ${strings.profile.posts.toLowerCase()}`}
            systemColor={Typography.colors.tertiary}
          />
          <Typography
            type={Typography.types.headline5}
            text=" • "
            systemColor={Typography.colors.tertiary}
          />
          <Typography
            type={Typography.types.headline5}
            text={`${item.comments.length} ${strings.profile.comments.toLowerCase()}`}
            systemColor={Typography.colors.tertiary}
          />
        </View>
      </View>
    </View>
  </Pressable>
)

export const SearchHistoryHeader = ({ onClear }) => (
  <View style={[styles.historyHeader, styles.paddingHorizontal]}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicon name="md-time" size={18} style={{ marginRight: 8 }} color={colors.textPrimary} />
      <Typography
        type={Typography.types.headline5}
        style={styles.sectionHeader}
        text={strings.search.recent_searches}
      />
    </View>
    <Typography
      type={Typography.types.textButton}
      style={[styles.sectionHeader, styles.sectionHeaderLink]}
      onPress={onClear}
      text={strings.search.clear_all}
    />
  </View>
)

const SearchUsers = ({ searchQuery, onSearch, onRecentSearch }) => {
  const [users, setUsers] = useState([])
  const [lastQuery, setLastQuery] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { users: usersHistory } = useSelector(recentSearchHistory)
  const dispatch = useDispatch()
  const { navigate } = useNavigation()

  const isFocused = useIsFocused()

  useEffect(() => {
    const query = searchQuery.trim()
    if (!isFocused) return
    if (query.length > 0) {
      setIsLoading(true)
      api.searchUsers(query)
        .then((data) => {
          setUsers(data)
          setLastQuery(query)
          dispatch({ type: types.ADD_USER_HISTORY, payload: query })
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setUsers([])
    }
  }, [dispatch, onSearch, searchQuery, isFocused, lastQuery])

  useEffect(() => {
    onSearch(isLoading)
  }, [isLoading, onSearch])

  const createKey = useCallback((item, index) => `basic-post-${item.id}-${index}`, [])

  const renderSearchResultsHeader = useCallback(() => (
    <Typography
      type={Typography.types.headline5}
      systemColor={colors.textTertiary}
      style={[styles.sectionHeader, styles.paddingHorizontal]}
      text={strings.search.results}
    />
  ), [])

  const onClearAllRecentSearches = useCallback(() => {
    dispatch({ type: types.CLEAR_USER_HISTORY })
  }, [dispatch])

  const onClearRecentSearch = useCallback((payload) => {
    dispatch({ type: types.REMOVE_USER_HISTORY, payload })
  }, [dispatch])

  const renderSearchHistoryHeader = useCallback(() => (
    <SearchHistoryHeader onClear={onClearAllRecentSearches} />
  ), [onClearAllRecentSearches])

  const renderSearchHistory = useCallback(({ item }) => (
    <HistoryItem onPress={onRecentSearch} onDelete={onClearRecentSearch} item={item} />
  ), [onClearRecentSearch, onRecentSearch])

  const displayProfile = useCallback((user) => {
    navigate(routes.USER_PROFILE, { userId: user.id })
  }, [navigate])

  const renderUser = useCallback(({ item }) => (
    <SearchResult item={item} onPress={displayProfile} />
  ), [displayProfile])

  return (
    <View style={styles.wrapper}>
      {searchQuery.length === 0 && (
        <FlatList
          data={usersHistory}
          contentContainerStyle={styles.flatlistContent}
          keyExtractor={createKey}
          ListHeaderComponent={renderSearchHistoryHeader}
          renderItem={renderSearchHistory}
          removeClippedSubviews
        />
      )}
      {users.length === 0 && searchQuery.length > 0 && !isLoading && (
        <NoResult query={searchQuery} />
      )}
      {users.length > 0 && (
        <FlatList
          data={users}
          contentContainerStyle={styles.flatlistContent}
          keyExtractor={createKey}
          ListHeaderComponent={renderSearchResultsHeader}
          renderItem={renderUser}
          removeClippedSubviews
        />
      )}
    </View>
  )
}

export default SearchUsers
