import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { AppHeader, Typography } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppColors, useAppStyles, useUser } from '@app/shared/hooks'

import createThemedStyles from './styles'
import { edgeInsets } from '@app/theme'
import routes from '@app/navigation/routes'

const routeOptions = { title: strings.tabs.rooms }

export const SearchIcon = ({ onPress }) => {
  const { colors } = useAppColors()
  return (
    <TouchableOpacity onPress={onPress} hitSlop={edgeInsets.all(15)}>
      <Ionicon name="add-outline" size={30} color={colors.textPrimary} />
    </TouchableOpacity>
  )
}

const RoomsPage = ({ navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const { profile } = useUser()

  return (
    <View style={styles.wrapper}>
      <AppHeader
        title={strings.tabs.rooms}
        text=""
        Right={() => <SearchIcon onPress={() => navigation.navigate(routes.CREATE_ROOM)} />}
        showAvatar={false}
        displayName={profile.displayName}
        imageSrc={profile.photoURL}
        style={styles.pageTitle}
      />
    </View>
  )
}

RoomsPage.routeOptions = routeOptions

export default RoomsPage
