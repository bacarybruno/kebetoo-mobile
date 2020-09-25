import React, { useState, useCallback, useRef } from 'react'
import { View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { colors, metrics, edgeInsets } from '@app/theme'
import strings from '@app/config/strings'
import TextInput from '@app/shared/components/inputs/text'
import Header from '@app/features/home/components/header'
import { useUser, useDebounce, useAnalytics } from '@app/shared/hooks'
import routes from '@app/navigation/routes'

import styles from './styles'
import SearchPosts from './posts'
import SearchUsers from './users'

const Tab = createMaterialTopTabNavigator()

const routeOptions = { title: strings.tabs.search }

const tabBarOptions = {
  activeTintColor: colors.primary,
  inactiveTintColor: colors.textTertiary,
  style: styles.tabbar,
  labelStyle: styles.label,
}

export const SearchIcon = ({ onPress }) => (
  <TouchableOpacity
    style={styles.searchIcon}
    onPress={onPress}
    hitSlop={edgeInsets.all(15)}
  >
    <Ionicon name="ios-search" size={23} color={colors.textPrimary} />
  </TouchableOpacity>
)

export const CancelIcon = ({ isLoading, onPress }) => (
  <View style={styles.cancelIcon}>
    {!isLoading && (
      <TouchableOpacity onPress={onPress} hitSlop={edgeInsets.all(15)}>
        <Ionicon name="ios-close" size={36} color={colors.textPrimary} />
      </TouchableOpacity>
    )}
    {isLoading && <ActivityIndicator size={23} color={colors.textPrimary} />}
  </View>
)

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { profile } = useUser()
  const { trackSearch } = useAnalytics()

  const textInputRef = useRef()

  const onChange = useCallback((terms) => {
    setSearchQuery(terms)
  }, [])

  const debouncedOnChange = useDebounce(onChange)

  const onCancel = useCallback(() => {
    setSearchQuery(null)
    textInputRef.current.clear()
    textInputRef.current.blur()
  }, [])

  const onSearch = useCallback((isSearching) => {
    if (isSearching) {
      trackSearch(searchQuery)
    }
    setIsLoading(isSearching)
  }, [trackSearch, searchQuery])

  const onRecentSearch = useCallback((text) => {
    onChange(text)
    textInputRef.current?.setNativeProps({ text })
  }, [onChange])

  const onShowSearchbar = useCallback(() => {
    setSearchQuery('')
  }, [])

  return (
    <View style={styles.wrapper}>
      {searchQuery === null
        ? (
          <Header
            text=""
            title={strings.search.search}
            displayName={profile.displayName}
            imageSrc={profile.photoURL}
            Right={() => <SearchIcon onPress={onShowSearchbar} />}
            style={{ marginHorizontal: metrics.marginHorizontal }}
          />
        ) : (
          <TextInput
            autoFocus
            placeholder={strings.search.placeholder}
            fieldName="searchQuery"
            onValueChange={debouncedOnChange}
            returnKeyType="search"
            wrapperStyle={styles.textInputWrapper}
            textStyle={styles.textInputStyle}
            ref={textInputRef}
            Left={SearchIcon}
            Right={() => <CancelIcon onPress={onCancel} isLoading={isLoading} />}
          />
        )}
      <Tab.Navigator tabBarOptions={tabBarOptions} sceneContainerStyle={styles.wrapper}>
        <Tab.Screen name={routes.SEARCH_POSTS} options={{ tabBarLabel: strings.search.posts_tab }}>
          {(props) => (
            <SearchPosts
              {...props}
              searchQuery={searchQuery || ''}
              onSearch={onSearch}
              onRecentSearch={onRecentSearch}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name={routes.SEARCH_USERS} options={{ tabBarLabel: strings.search.users_tab }}>
          {(props) => (
            <SearchUsers
              {...props}
              searchQuery={searchQuery || ''}
              onSearch={onSearch}
              onRecentSearch={onRecentSearch}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  )
}

SearchPage.routeOptions = routeOptions

export default SearchPage
