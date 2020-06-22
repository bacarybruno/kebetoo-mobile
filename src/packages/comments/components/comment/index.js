import React, { useCallback, useState } from 'react'
import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import dayjs from 'dayjs'

import CommentPlaceholder from 'Kebetoo/src/shared/components/placeholders/comments'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import Text, { fontSizes } from 'Kebetoo/src/shared/components/text'
import { BASE_URL } from 'Kebetoo/src/shared/helpers/http'
import { getPostType, POST_TYPES } from 'Kebetoo/src/packages/post/containers/basic-post'
import AudioPlayer from 'Kebetoo/src/shared/components/audio-player'
import { REACTION_TYPES } from 'Kebetoo/src/packages/post/containers/reactions'
import colors from 'Kebetoo/src/theme/colors'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import * as api from 'Kebetoo/src/shared/helpers/http'
import { extractMetadataFromName } from 'Kebetoo/src/shared/hooks/audio-recorder'

import styles from './styles'

export const getAudioSource = (url) => `${BASE_URL}${url}`

const Reactions = ({ onReaction, reactions, user }) => {
  const loved = reactions.find((reaction) => (
    reaction.author === user && reaction.type === REACTION_TYPES.LOVE
  ))
  return (
    <View style={styles.reactionsWrapper}>
      <TouchableOpacity
        style={styles.reactionsButton}
        onPress={() => onReaction(REACTION_TYPES.LOVE)}
        hitSlop={edgeInsets.all(30)}
      >
        <Text text={`${reactions.length} `} size="xs" bold />
        <Ionicon
          name={loved ? 'md-heart' : 'md-heart-empty'}
          color={loved ? colors.heart : undefined}
          size={fontSizes.md}
        />
      </TouchableOpacity>
    </View>
  )
}

const Header = ({ displayName, updatedAt }) => (
  <View style={styles.row}>
    <Text numberOfLines={1} size="sm" ellipsizeMode="middle">
      {displayName}
      {' • '}
      {dayjs(updatedAt).fromNow()}
    </Text>
  </View>
)

const Content = ({ item }) => {
  switch (getPostType(item)) {
    case POST_TYPES.AUDIO:
      return (
        <AudioPlayer
          style={styles.audio}
          source={getAudioSource(item.audio.url)}
          duration={parseInt(extractMetadataFromName(item.audio.name).duration, 10)}
        />
      )
    case POST_TYPES.TEXT:
      return <Text text={item.content} />
    default:
      return null
  }
}

const Comment = ({
  item, displayName, photoURL, user,
}) => {
  const [reactions, setReactions] = useState((value) => value || item.reactions)
  const [lastPress, setLastPress] = useState(null)
  const DOUBLE_PRESS_DELAY = 200

  const onReaction = useCallback(async (type) => {
    const userReaction = reactions.find((r) => r.author === user)
    if (userReaction === undefined) {
      const result = await api.createCommentReaction(type, item.id, user)
      setReactions((values) => {
        values.push(result)
        return [...values]
      })
    } else if (userReaction.type === type) {
      await api.deleteReaction(userReaction.id)
      setReactions((values) => {
        const filteredReactions = values.filter((r) => r.id !== userReaction.id)
        return [...filteredReactions]
      })
    } else {
      await api.editReaction(userReaction.id, type)
      setReactions((values) => {
        const reaction = values.find((r) => r.id === userReaction.id)
        reaction.type = type
        values.map((v) => (v.id === item.id ? reaction : v))
        return [...values]
      })
    }
  }, [item.id, reactions, user])

  const onPress = useCallback(() => {
    const now = new Date().getTime()
    if (lastPress && (now - lastPress) < DOUBLE_PRESS_DELAY) {
      setLastPress(null)
      // double press
      onReaction(REACTION_TYPES.LOVE)
    } else {
      setLastPress(now)
    }
  }, [lastPress, onReaction])

  if (!displayName) return <CommentPlaceholder />

  return (
    <TouchableWithoutFeedback style={styles.row} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.avatarWrapper}>
          <Avatar src={photoURL} text={displayName} size={35} />
        </View>
        <View style={styles.flexible}>
          <Header displayName={displayName} updatedAt={item.updatedAt} />
          <Content item={item} />
          <Reactions reactions={reactions} user={user} onReaction={onReaction} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default React.memo(Comment)
