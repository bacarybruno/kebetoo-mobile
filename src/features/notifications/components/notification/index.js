import React from 'react'
import { View, Text } from 'react-native'

import { Pressable, Avatar, Typography } from '@app/shared/components'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

export const Dot = () => {
  const styles = useAppStyles(createThemedStyles)
  return <View style={styles.dot} />
}

export const Title = ({ name, message, hasBadge, showDot }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.headerTitleWrapper}>
      <Text style={styles.headerTitle} numberOfLines={2}>
        {name && (
          <Text>
            <Typography
              text={`${name} `}
              type={Typography.types.headline4}
              systemWeight={Typography.weights.semibold}
              hasBadge={hasBadge}
            />
          </Text>
        )}
        <Typography text={message} type={Typography.types.headline4} />
      </Text>
      {showDot && <Dot />}
    </View>
  )
}

export const Message = ({ text }) => (
  <Typography numberOfLines={1} type={Typography.types.body} text={text} />
)

const Notification = ({
  isOpened, title, message, caption, author, onPress,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <Pressable
      style={[styles.notificationWrapper, !isOpened && styles.pendingNotification]}
      onPress={onPress}
    >
      <Avatar text={author.displayName} src={author.photoURL} size={55} fontSize={25} />
      <View style={styles.notificationInfos}>
        {title && (
          <Title
            name={title.name}
            message={title.message}
            hasBadge={title.certified}
            showDot={!isOpened}
          />
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
}

export default Notification
