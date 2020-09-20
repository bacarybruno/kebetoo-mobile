import React from 'react'
import { View, Text } from 'react-native'

import Pressable from '@app/shared/components/buttons/pressable'
import Avatar from '@app/shared/components/avatar'
import { colors } from '@app/theme'
import Typography, { types, weights, colors as systemColors } from '@app/shared/components/typography'

import styles from './styles'

export const Dot = () => <View style={styles.dot} />

export const Title = ({ name, message, showDot }) => (
  <View style={styles.headerTitleWrapper}>
    <Text style={styles.headerTitle} numberOfLines={2}>
      <Typography text={name} type={types.headline4} systemWeight={weights.semibold} />
      <Typography text={` ${message}`} type={types.headline4} />
    </Text>
    {showDot && <Dot />}
  </View>
)

export const Message = ({ text }) => (
  <Typography numberOfLines={1} type={types.body} text={text} />
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
          type={types.body}
          color={systemColors.tertiary}
          style={styles.notificationCaption}
        />
      </View>
    </View>
  </Pressable>
)

export default Notification
