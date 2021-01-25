import React, { useCallback, useState } from 'react'
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { AppHeader, Avatar, FullButton, TextInput, Typography } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'
import useRooms from '../../hooks/rooms'

const routeOptions = { title: strings.create_room.create_room }

const ColorPicker = ({ items, selectedItem, onChange = () => { } }) => {
  const { colors } = useAppColors()
  const styles = useAppStyles(createThemedStyles)

  const itemsPerRow = 3
  const itemSize = 65

  const renderColor = useCallback(({ item, index }) => {
    const isSelected = selectedItem === item.name
    return (
      <TouchableOpacity onPress={() => onChange(item.name)} style={{ width: itemSize, height: itemSize, backgroundColor: item.color, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
        {isSelected && <Ionicon name="checkmark-sharp" size={40} color={colors.white} />}
      </TouchableOpacity>
    )
  }, [selectedItem, onChange])

  const keyExtractor = useCallback((item) => item.name, [])

  return (
    <FlatList
      data={items}
      renderItem={renderColor}
      numColumns={itemsPerRow}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.flatlistContent}
      columnWrapperStyle={styles.flatlistColumn}
    />
  )
}

const CresteRoomPage = ({ navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { colors } = useAppColors()
  const roomColors = [{
    color: colors.blue,
    name: 'blue'
  }, {
    color: colors.orange,
    name: 'orange'
  }, {
    color: colors.yellow,
    name: 'yellow'
  }, {
    color: colors.purple,
    name: 'purple'
  }, {
    color: colors.green,
    name: 'green'
  }, {
    color: colors.indigo,
    name: 'indigo'
  }, {
    color: colors.pink,
    name: 'pink'
  }, {
    color: colors.teal,
    name: 'teal'
  }, {
    color: colors.red,
    name: 'red'
  }]
  const [color, setColor] = useState(roomColors[0].name)
  const { createRoom } = useRooms()

  const onSubmit = useCallback(async () => {
    if (!name) return
    setIsLoading(true)
    await createRoom({ name, theme: color })
    setIsLoading(false)
    navigation.goBack()
  }, [name, color, navigation])

  return (
    <View style={styles.wrapper}>
      <AppHeader
        title={routeOptions.title}
        text=""
        showAvatar={false}
        headerBack
      />
      <ScrollView style={styles.content}>
        <View style={styles.inputWrapper}>
          <Typography type={Typography.types.headline4} text="" style={styles.label} />
          <View style={styles.roomName}>
            <Avatar size={80} color={colors[color]} text={name || 'K'} fontSize={40} />
            <TextInput
              placeholder={strings.create_room.room_name}
              fieldName="name"
              onValueChange={setName}
              value={name}
              maxLength={40}
              textStyle={styles.textInput}
              wrapperStyle={styles.textInputWrapper}
            />
          </View>
          <Typography type={Typography.types.subheading} text={strings.create_room.room_theme} style={styles.label} />
          <ColorPicker items={roomColors} selectedItem={color} onChange={setColor} />
        </View>
      </ScrollView>
      <FullButton
        style={styles.saveButton}
        text={strings.general.create.toUpperCase()}
        onPress={onSubmit}
        loading={isLoading}
        disabled={!name}
      />
    </View>
  )
}
CresteRoomPage.routeOptions = routeOptions

export default CresteRoomPage
