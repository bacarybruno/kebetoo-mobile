import { useCallback, useEffect, useState } from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import dayjs from 'dayjs'

import { AppHeader, SegmentedControl } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppColors, useAppStyles, useUser } from '@app/shared/hooks'
import { readableNumber } from '@app/shared/helpers/strings'
import { edgeInsets } from '@app/theme'
import routes from '@app/navigation/routes'

import createThemedStyles from './styles'
import Room from '../components/room'
import useRooms from '../hooks/rooms'
// eslint-disable-next-line import/no-cycle
import { getSystemMessage } from './room'

const routeOptions = { title: strings.tabs.rooms }

export const RightIcon = ({ onPress }) => {
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
    label: strings.formatString(strings.rooms.discover, readableNumber(discoverRooms.length)),
    value: 'discover',
  }, {
    label: strings.formatString(strings.rooms.my_rooms, readableNumber(rooms.length)),
    value: 'rooms',
  }]
  const [selectedValue, setSelectedValue] = useState(filterItems[0].value)

  const navigateToRoom = useCallback((room) => {
    navigation.navigate(routes.ROOM, room)
  }, [navigation])

  const renderRoom = useCallback(({ item }) => {
    if (!item?.members) return null
    return (
      <Room
        isOpened
        onPress={() => navigateToRoom(item)}
        membersCount={Object.keys(item.members)?.length ?? 0}
        title={item.name}
        room={{ displayName: item.name }}
        caption={dayjs(item.updatedAt || item.createdAt).fromNow()}
        theme={item.theme}
        message={
          item.lastMessage?.system
            ? getSystemMessage(item.lastMessage)
            : (item.lastMessage?.text ?? 'Audio')
        }
      />
    )
  }, [navigateToRoom])

  const renderDiscoverRoom = useCallback(({ item }) => {
    if (!item?.members) return null
    return (
      <Room.Discover
        onPress={() => navigateToRoom(item)}
        membersCount={Object.keys(item.members)?.length ?? 0}
        title={item.name}
        author={item.author.displayName}
        room={{ displayName: item.name }}
        caption={dayjs(item.updatedAt || item.createdAt).fromNow()}
        theme={item.theme}
      />
    )
  }, [navigateToRoom])

  useEffect(() => {
    if (rooms.length > 0) {
      setSelectedValue('rooms')
    } else {
      setSelectedValue('discover')
    }
  }, [rooms])

  const sortByName = useCallback((a, b) => {
    if (a?.name && b?.name) {
      return a.name.localeCompare(b.name)
    }
    return 0
  }, [])

  const sortByMembersCount = useCallback((a, b) => {
    if (a?.members && b?.members) {
      return Object.keys(b.members).length - Object.keys(a.members).length
    }
    return 0
  }, [])

  const ListHeaderComponent = (
    <SegmentedControl
      items={filterItems}
      style={styles.segmentedControl}
      onSelect={(item) => setSelectedValue(item.value)}
      selectedValue={selectedValue}
    />
  )

  return (
    <View style={styles.wrapper}>
      <AppHeader
        title={strings.tabs.rooms}
        Right={<RightIcon onPress={() => navigation.navigate(routes.CREATE_ROOM)} />}
        displayName={profile.displayName}
        imageSrc={profile.photoURL}
        style={styles.padding}
      />
      {selectedValue === 'rooms' && (
        <FlatList
          data={rooms.sort(sortByName)}
          renderItem={renderRoom}
          ListHeaderComponent={ListHeaderComponent}
          removeClippedSubviews
        />
      )}
      {selectedValue === 'discover' && (
        <FlatList
          data={discoverRooms.sort(sortByMembersCount)}
          renderItem={renderDiscoverRoom}
          ListHeaderComponent={ListHeaderComponent}
          removeClippedSubviews
        />
      )}
    </View>
  )
}

RoomsPage.routeOptions = routeOptions

export default RoomsPage
