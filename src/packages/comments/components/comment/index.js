import React, { memo } from 'react'
import { View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import dayjs from 'dayjs'

import CommentPlaceholder from 'Kebetoo/src/shared/components/placeholders/comments'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import Text from 'Kebetoo/src/shared/components/text'
import { AudioPlayer } from 'Kebetoo/src/packages/post/components/audio-content'
import { BASE_URL } from 'Kebetoo/src/shared/helpers/http'

import styles from './styles'

export const getAudioSource = (url) => `${BASE_URL}${url}`


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
                <Text size="xs" text=" • " />
                <Text size="xs" text={`${dayjs(item.updatedAt).fromNow()}`} />
              </Text>
            </View>
          </View>
          {item.audio && item.audio.url !== null
            ? (
              <AudioPlayer style={styles.audio} source={getAudioSource(item.audio.url)} />
            ) : (
              <Text text={item.content} />
            )}
        </View>
      </View>
      <Ionicon name="ios-heart-empty" size={15} style={styles.loveIcon} />
    </>
  ) : <CommentPlaceholder />
)

export default memo(Comment)
