import React from 'react'
import { View, Text } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { Pressable, Avatar, Typography } from '@app/shared/components'
import { useAppColors, useAppStyles } from '@app/shared/hooks'
import { abbreviateNumber } from '@app/shared/helpers/strings'

import createThemedStyles from './styles'

export const Dot = () => {
  const styles = useAppStyles(createThemedStyles)
  return <View style={styles.dot} />
}

export const Title = ({ name, info, Right }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.headerTitleWrapper}>
      <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="middle">
        <Typography
          text={name}
          type={Typography.types.headline4}
          systemWeight={Typography.weights.semibold}
        />
        {info && (
          <>
            <Typography text=" • " />
            <Typography text={info} />
          </>
        )}
      </Text>
      {Right}
    </View>
  )
}

export const Message = ({ text }) => (
  <Typography numberOfLines={2} type={Typography.types.body} color={Typography.colors.secondary} text={text} />
)

const Room = ({
  isOpened, title, membersCount, message, caption, room, onPress, theme,
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <Pressable
      style={[styles.roomWrapper, !isOpened && styles.pendingRoom]}
      onPress={onPress}
    >
      <Avatar color={colors[theme]} text={room.displayName} src={room.photoURL} size={55} fontSize={25} />
      <View style={styles.roomInfos}>
        {title && (
          <Title name={title} info={`${abbreviateNumber(membersCount)} members`} Right={!isOpened ? <Dot /> : null} />
        )}
        <Message text={message} />
        <Typography
          text={caption}
          type={Typography.types.headline5}
          color={Typography.colors.tertiary}
        />
      </View>
    </Pressable>
  )
}

const NextButton = () => {
  const { colors } = useAppColors()
  return (
    <Ionicon name="chevron-forward-outline" size={25} color={colors.textPrimary} />
  )
}

Room.Discover = ({
  title, membersCount, author, caption, room, onPress, theme,
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <Pressable style={styles.roomWrapper} onPress={onPress}>
      <Avatar color={colors[theme]} text={room.displayName} src={room.photoURL} size={55} fontSize={25} />
      <View style={styles.roomInfos}>
        {title && (
          <Title name={title} info={`${abbreviateNumber(membersCount)} members`} Right={<NextButton />} />
        )}
        <Message text={`Created by ${author}`} />
        <Typography
          text={caption}
          type={Typography.types.headline5}
          color={Typography.colors.tertiary}
        />
      </View>
    </Pressable>
  )
}

export default Room
