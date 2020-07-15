import React, { useState, useCallback, useRef } from 'react'
import { View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Ionicon from 'react-native-vector-icons/Ionicons'

import colors from 'Kebetoo/src/theme/colors'
import strings from 'Kebetoo/src/config/strings'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import useDebounce from 'Kebetoo/src/shared/hooks/debounce'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'

import styles from './styles'
import Posts from './posts'
import Users from './users'

const Tab = createMaterialTopTabNavigator()

const routeOptions = { title: strings.tabs.search }

const tabBarOptions = {
  activeTintColor: colors.primary,
  inactiveTintColor: colors.textTertiary,
  style: styles.tabbar,
  labelStyle: styles.label,
}

const SearchIcon = () => (
  <View style={styles.searchIcon}>
    <Ionicon name="ios-search" size={23} color={colors.textPrimary} />
  </View>
)

const CancelIcon = ({ isLoading, onPress }) => (
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
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const textInputRef = useRef()

  const onChange = useCallback((terms) => {
    setSearchQuery(terms)
  }, [])

  const debouncedOnChange = useDebounce(onChange)

  const onCancel = useCallback(() => {
    setSearchQuery('')
    textInputRef.current.clear()
    textInputRef.current.blur()
  }, [])

  const onSearch = useCallback((state) => {
    setIsLoading(state)
  }, [])

  const onRecentSearch = useCallback((text) => {
    onChange(text)
    textInputRef.current.setNativeProps({ text })
  }, [onChange])

  return (
    <View style={styles.wrapper}>
      <TextInput
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
      <Tab.Navigator tabBarOptions={tabBarOptions} sceneContainerStyle={styles.wrapper}>
        <Tab.Screen name={strings.search.posts_tab}>
          {(props) => (
            <Posts
              {...props}
              searchQuery={searchQuery}
              onSearch={onSearch}
              onRecentSearch={onRecentSearch}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name={strings.search.users_tab}>
          {(props) => (
            <Users
              {...props}
              searchQuery={searchQuery}
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
