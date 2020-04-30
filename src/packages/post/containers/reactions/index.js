import React, { memo, useCallback } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import colors from 'Kebetoo/src/theme/colors'
import EdgeInsets from 'Kebetoo/src/theme/edge-insets'
import routes from 'Kebetoo/src/navigation/routes'
import * as types from 'Kebetoo/src/redux/types'
import { ThemedText } from 'Kebetoo/src/shared/components/text'

import styles from './styles'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
}


export const hasLiked = ({ post, author }) => post
  .likes
  .some((like) => like.author === author.id)

export const hasCommented = ({ post, author }) => post
  .comments
  .some((comment) => comment.author === author.id)

export const hasDisliked = ({ post, author }) => post
  .dislikes
  .some((dislike) => dislike.author === author.id)

export const Reaction = ({
  iconName,
  count,
  onPress,
  color = colors.blue_dark,
}) => (
  <TouchableOpacity
    style={styles.reaction}
    onPress={onPress}
    hitSlop={EdgeInsets.symmetric({
      horizontal: 5, vertical: 25,
    })}
  >
    <Kebeticon color={color} style={styles.icon} size={18} name={iconName} />
    <ThemedText size="xs" bold text={count.toString()} />
  </TouchableOpacity>
)

const Reactions = ({
  post, author, onLike, onDislike, onComment,
}) => {
  const liked = hasLiked({ post, author })
  const disliked = hasDisliked({ post, author })
  const dispatch = useDispatch()
  const { navigate } = useNavigation()

  const onReaction = useCallback(async (type) => {
    switch (type) {
      case REACTION_TYPES.LIKE:
        if (onLike) return onLike()
        return dispatch({
          type: types.API_TOGGLE_LIKE_POST,
          payload: { post, author },
        })
      case REACTION_TYPES.DISLIKE:
        if (onDislike) return onDislike()
        return dispatch({
          type: types.API_TOGGLE_DISLIKE_POST,
          payload: { post, author },
        })
      case REACTION_TYPES.COMMENT:
        if (onComment) return onComment()
        return navigate(routes.COMMENTS, { id: post.id })
      default: break
    }
    return null
  }, [onLike, dispatch, post, author, onDislike, onComment, navigate])

  return (
    <View style={styles.reactions}>
      <Reaction
        iconName={liked ? 'like-fill' : 'like'}
        count={post.likes.length}
        onPress={() => onReaction(REACTION_TYPES.LIKE)}
      />
      <Reaction
        iconName={disliked ? 'dislike-fill' : 'dislike'}
        count={post.dislikes.length}
        onPress={() => onReaction(REACTION_TYPES.DISLIKE)}
      />
      <Reaction
        iconName="comment"
        count={post.comments.length}
        onPress={() => onReaction(REACTION_TYPES.COMMENT)}
      />
      <Reaction
        iconName="share"
        count={0}
        onPress={() => { }}
      />
    </View>
  )
}

export default memo(Reactions)
