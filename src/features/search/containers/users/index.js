import { useEffect, useState, useCallback } from 'react'
import { View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { api } from '@app/shared/services'
import {
  Typography, Avatar, Pressable, NoContent,
} from '@app/shared/components'
import * as types from '@app/redux/types'
import { recentSearchHistory } from '@app/redux/selectors'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'
import { useAppColors, useAppStyles } from '@app/shared/hooks'
import HistoryItem from '@app/features/search/components/history-item'
import NoResult from '@app/features/search/components/no-result'

import createThemedStyles from './styles'


export const SearchResult = ({ item, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  const onItemPress = useCallback(() => onPress(item), [item, onPress])
  return (
    <Pressable style={[styles.searchResult, styles.paddingHorizontal]} onPress={onItemPress}>
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
}

export const SearchHistoryHeader = ({ onClear }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  return (
    <View style={[styles.historyHeader, styles.paddingHorizontal]}>
      <View style={styles.container}>
        <Ionicon name="md-time" size={18} style={styles.icon} color={colors.textPrimary} />
        <Typography
          type={Typography.types.subheading}
          systemWeight={Typography.weights.semibold}
          systemColor={Typography.colors.tertiary}
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
}

const SearchUsers = ({ searchQuery, onSearch, onRecentSearch }) => {
  const [users, setUsers] = useState([])
  const [lastQuery, setLastQuery] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { users: usersHistory } = useSelector(recentSearchHistory)
  const dispatch = useDispatch()
  const { navigate } = useNavigation()

  const styles = useAppStyles(createThemedStyles)

  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length > 0) {
      setIsLoading(true)
      api.authors.search(query)
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
  }, [dispatch, onSearch, searchQuery, lastQuery])

  useEffect(() => {
    onSearch(isLoading)
  }, [isLoading, onSearch])

  const createKey = useCallback((item, index) => `basic-post-${item.id}-${index}`, [])

  const renderSearchResultsHeader = useCallback(() => (
    <Typography
      type={Typography.types.subheading}
      systemWeight={Typography.weights.semibold}
      systemColor={Typography.colors.tertiary}
      style={[styles.sectionHeader, styles.paddingHorizontal]}
      text={strings.search.results}
    />
  ), [styles])

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
      {users.length === 0 && usersHistory.length === 0 && (
        <View style={styles.noContent}>
          <NoContent text={strings.search.no_content} title={strings.general.no_content} />
        </View>
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
