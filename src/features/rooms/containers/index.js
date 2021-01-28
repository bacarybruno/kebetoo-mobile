import React, { useCallback, useState } from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { AppHeader, SegmentedControl } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppColors, useAppStyles, useUser } from '@app/shared/hooks'
import { abbreviateNumber } from '@app/shared/helpers/strings'
import { edgeInsets } from '@app/theme'
import routes from '@app/navigation/routes'

import createThemedStyles from './styles'
import Room from '../components/room'
import dayjs from 'dayjs'
import useRooms from '../hooks/rooms'
import { getSystemMessage } from './room'

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
  const { rooms, discoverRooms } = useRooms()
  const { profile } = useUser()

  const filterItems = [{
    label: strings.formatString(strings.rooms.my_rooms, abbreviateNumber(rooms.length)),
    value: 'rooms',
  }, {
    label: strings.formatString(strings.rooms.discover, abbreviateNumber(discoverRooms.length)),
    value: 'discover',
  }]
  const [selectedValue, setSelectedValue] = useState(filterItems[0].value)

  const navigateToRoom = useCallback((room) => {
    navigation.navigate(routes.ROOM, room)
  }, [])

  const renderRoom = useCallback(({ item, index }) => (
    <Room
      isOpened={false}
      onPress={() => navigateToRoom(item)}
      membersCount={Object.keys(item.members)?.length ?? 0}
      title={item.name}
      message={item.lastMessage?.system ? getSystemMessage(item.lastMessage) : item.lastMessage?.text}
      room={{ displayName: item.name }}
      caption={dayjs(item.updatedAt || item.createdAt).fromNow()}
      theme={item.theme}
    />
  ), [])

  const renderDiscoverRoom = useCallback(({ item, index }) => (
    <Room.Discover
      onPress={() => navigateToRoom(item)}
      membersCount={Object.keys(item.members)?.length ?? 0}
      title={item.name}
      author={item.author.displayName}
      room={{ displayName: item.name }}
      caption={dayjs(item.updatedAt || item.createdAt).fromNow()}
      theme={item.theme}
    />
  ), [])

  return (
    <View style={styles.wrapper}>
      <AppHeader
        title={strings.tabs.rooms}
        text=""
        Right={() => <SearchIcon onPress={() => navigation.navigate(routes.CREATE_ROOM)} />}
        showAvatar={false}
        displayName={profile.displayName}
        imageSrc={profile.photoURL}
        style={styles.padding}
      />
      <SegmentedControl
        items={filterItems}
        style={styles.segmentedControl}
        onSelect={(item) => setSelectedValue(item.value)}
        selectedValue={selectedValue}
      />
      {selectedValue === filterItems[0].value && (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          removeClippedSubviews
        />
      )}
      {selectedValue === filterItems[1].value && (
        <FlatList
          data={discoverRooms}
          renderItem={renderDiscoverRoom}
          removeClippedSubviews
        />
      )}
    </View>
  )
}

RoomsPage.routeOptions = routeOptions

export default RoomsPage
