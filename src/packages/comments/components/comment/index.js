import React, { memo } from 'react'
import { View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import CommentPlaceholder from 'Kebetoo/src/shared/components/placeholders/comments'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'

const Comment = ({ item, author }) => (
  author ? (
    <>
      <View style={{ flexDirection: 'row', ...styles.flexible }}>
        <View style={{ marginRight: 10 }}>
          <Avatar
            src={author.photoURL}
            text={author.displayName}
            size={35}
          />
        </View>
        <View style={styles.flexible}>
          <View style={styles.flexible}>
            <View style={{ flexDirection: 'row', ...styles.flexible }}>
              <Text numberOfLines={1}>
                {author.displayName}
                <Text size="sm" text=" • " />
                <Text size="sm" text={`${moment(item.updatedAt).fromNow()}`} />
              </Text>
            </View>
          </View>
          <Text text={item.content} />
        </View>
      </View>
      <Ionicon name="ios-heart-empty" size={15} style={styles.loveIcon} />
    </>
  ) : <CommentPlaceholder />
)

export default memo(Comment)
