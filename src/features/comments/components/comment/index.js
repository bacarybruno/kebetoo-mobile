import React, { useCallback, useState, useEffect } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import dayjs from 'dayjs'
import { useNavigation } from '@react-navigation/native'

import {
  CommentPlaceholder, Avatar, Typography, AudioPlayer, Pressable,
} from '@app/shared/components'
import { getPostType, POST_TYPES } from '@app/features/post/containers/basic-post'
import { REACTION_TYPES } from '@app/features/post/containers/reactions'
import { colors } from '@app/theme'
import * as api from '@app/shared/services/http'
import { extractMetadataFromName } from '@app/shared/hooks/audio-recorder'
import routes from '@app/navigation/routes'
import { env, strings } from '@app/config'

import styles from './styles'

export const getAudioSource = (url) => (
  url.startsWith('http')
    ? url
    : `${env.assetsBaseUrl}/${url.startsWith('/') ? url.substr(1) : url}`
)

export const Reactions = ({
  onReaction, reactions, user, repliesCount, onShowReplies,
}) => {
  const loved = reactions.find((reaction) => (
    reaction.author === user && reaction.type === REACTION_TYPES.LOVE
  ))
  return (
    <View style={styles.reactionsWrapper}>
      <Pressable borderless style={styles.repliesCount} onPress={onShowReplies}>
        {repliesCount > 0 && (
          <Typography
            type={Typography.types.headline5}
            text={strings.formatString(strings.comments.reply_count, repliesCount)}
          />
        )}
      </Pressable>
      {repliesCount > 0 && <Typography type={Typography.types.headline5} text="|" />}
      <Pressable
        borderless
        foreground
        style={styles.reactionsButton}
        onPress={() => onReaction(REACTION_TYPES.LOVE)}
        testID="reaction-button"
      >
        <Typography
          type={Typography.types.headline5}
          text={reactions.length}
          systemColor={Typography.colors.primary}
        />
        <Typography type={Typography.types.body} text=" " />
        <Ionicon
          name={loved ? 'md-heart' : 'md-heart-empty'}
          testID="reaction"
          color={loved ? colors.heart : colors.textPrimary}
          size={Typography.fontSizes.md}
        />
      </Pressable>
    </View>
  )
}

const Header = ({ displayName, updatedAt }) => (
  <View style={styles.header}>
    <Typography type={Typography.types.headline5} text={displayName} />
    <Typography type={Typography.types.headline5} text=" • " />
    <Typography type={Typography.types.headline6} text={dayjs(updatedAt).fromNow()} />
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
      return <Typography type={Typography.types.body} text={item.content} />
    default:
      return null
  }
}

const Comment = ({
  item, displayName, photoURL, user, authorId, repliesCount, onShowReplies,
}) => {
  const [reactions, setReactions] = useState(item.reactions)
  const [lastPress, setLastPress] = useState(null)
  const DOUBLE_PRESS_DELAY = 200

  useEffect(() => {
    setReactions(item.reactions)
  }, [item.reactions])

  const { navigate } = useNavigation()

  // TODO: optimistic ui update
  const onReaction = useCallback(async (type) => {
    const userReaction = reactions.find((r) => r.author === user)
    if (userReaction === undefined) {
      const result = await api.createCommentReaction(type, item.id, user)
      result.author = result.author.id
      setReactions((values) => values.concat([result]))
    } else if (userReaction.type === type) {
      await api.deleteReaction(userReaction.id)
      setReactions((values) => values.filter((r) => r.id !== userReaction.id))
    }
    // // Will be used when we'll have many reactions for comments
    // else {
    //   await api.editReaction(userReaction.id, type)
    //   setReactions((values) => {
    //     const reaction = values.find((r) => r.id === userReaction.id)
    //     reaction.type = type
    //     values.map((v) => (v.id === item.id ? reaction : v))
    //     return [...values]
    //   })
    // }
  }, [item.id, reactions, user])

  const onPress = useCallback(async () => {
    const now = new Date().getTime()
    if (lastPress && (now - lastPress) < DOUBLE_PRESS_DELAY) {
      setLastPress(null)
      // double press
      await onReaction(REACTION_TYPES.LOVE)
    } else {
      setLastPress(now)
    }
  }, [lastPress, onReaction])

  const onShowProfile = useCallback(() => {
    navigate(routes.USER_PROFILE, { userId: authorId })
  }, [navigate, authorId])

  if (!displayName?.trim().length > 0) return <CommentPlaceholder />

  return (
    <TouchableWithoutFeedback style={styles.row} onPress={onPress}>
      <View style={styles.row}>
        <TouchableWithoutFeedback onPress={onShowProfile}>
          <View style={styles.avatarWrapper}>
            <Avatar src={photoURL} text={displayName} size={35} />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.flexible}>
          <Header displayName={displayName} updatedAt={item.updatedAt} />
          <Content item={item} />
          <Reactions
            reactions={reactions}
            user={user}
            onReaction={onReaction}
            repliesCount={repliesCount}
            onShowReplies={onShowReplies}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Comment
