import React from 'react'
import { View, Text } from 'react-native'

import { Pressable, Avatar, Typography } from '@app/shared/components'
import { colors } from '@app/theme'

import styles from './styles'

export const Dot = () => <View style={styles.dot} />

export const Title = ({ name, message, showDot }) => (
  <View style={styles.headerTitleWrapper}>
    <Text style={styles.headerTitle} numberOfLines={2}>
      <Typography
        text={name}
        type={Typography.types.headline4}
        systemWeight={Typography.weights.semibold}
      />
      <Typography text={` ${message}`} type={Typography.types.headline4} />
    </Text>
    {showDot && <Dot />}
  </View>
)

export const Message = ({ text }) => (
  <Typography numberOfLines={1} type={Typography.types.body} text={text} />
)

const Notification = ({
  isOpened, title, message, caption, author, onPress,
}) => (
  <Pressable
    style={[styles.notificationWrapper, !isOpened && { backgroundColor: colors.secondary }]}
    onPress={onPress}
  >
    <Avatar text={author.displayName} src={author.photoURL} size={55} fontSize={25} />
    <View style={styles.notificationInfos}>
      {title && (
        <Title name={title.name} message={title.message} showDot={!isOpened} />
      )}
      {message && <Message text={message} />}
      <View style={styles.captionWrapper}>
        <Typography
          text={caption}
          type={Typography.types.body}
          color={Typography.colors.tertiary}
          style={styles.notificationCaption}
        />
      </View>
    </View>
  </Pressable>
)

export default Notification
