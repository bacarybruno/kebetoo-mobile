import React, { useCallback, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import dayjs from 'dayjs'

import CommentPlaceholder from 'Kebetoo/src/shared/components/placeholders/comments'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import Text, { fontSizes } from 'Kebetoo/src/shared/components/text'
import { AudioPlayer } from 'Kebetoo/src/packages/post/components/audio-content'
import { BASE_URL } from 'Kebetoo/src/shared/helpers/http'
import { getPostType, POST_TYPES } from 'Kebetoo/src/packages/post/containers/basic-post'
import { REACTION_TYPES } from 'Kebetoo/src/packages/post/containers/reactions'
import colors from 'Kebetoo/src/theme/colors'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import * as api from 'Kebetoo/src/shared/helpers/http'

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
          round
          style={styles.audio}
          source={getAudioSource(item.audio.url)}
        />
      )
    case POST_TYPES.TEXT:
      return <Text text={item.content} />
    default:
      return null
  }
}

const Comment = ({ item, author, user }) => {
  const [reactions, setReactions] = useState((value) => value || item.reactions)

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

  return (
    author ? (
      <View style={styles.row}>
        <View style={styles.avatarWrapper}>
          <Avatar src={author.photoURL} text={author.displayName} size={35} />
        </View>
        <View style={styles.flexible}>
          <Header displayName={author.displayName} updatedAt={item.updatedAt} />
          <Content item={item} />
          <Reactions reactions={reactions} user={user} onReaction={onReaction} />
        </View>
      </View>
    ) : <CommentPlaceholder />
  )
}

export default React.memo(Comment)
