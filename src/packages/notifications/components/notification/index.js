import React from 'react'
import { View, Text } from 'react-native'

import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import colors from 'Kebetoo/src/theme/colors'
import Typography, { types, weights, colors as systemColors } from 'Kebetoo/src/shared/components/typography'

import styles from './styles'

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
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            <Typography text={title.name} type={types.headline4} systemWeight={weights.semibold} />
            <Typography text={` ${title.message}`} type={types.headline4} />
          </Text>
          {!isOpened && <View style={styles.dot} />}
        </View>
      )}
      {message && (
        <Typography numberOfLines={1} type={types.body} text={message} />
      )}
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
