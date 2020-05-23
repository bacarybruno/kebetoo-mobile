import React, { memo, useCallback } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import colors from 'Kebetoo/src/theme/colors'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import routes from 'Kebetoo/src/navigation/routes'
import * as types from 'Kebetoo/src/redux/types'
import Text, { ThemedText } from 'Kebetoo/src/shared/components/text'
import { reactionsSelector, postsSelector } from 'Kebetoo/src/redux/selectors'

import styles from './styles'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
}

export const Reaction = ({
  iconName, count, onPress, color = colors.blue_dark, disabled,
}) => (
  <TouchableOpacity
    style={styles.reaction}
    onPress={onPress}
    disabled={disabled}
    hitSlop={edgeInsets.symmetric({
      horizontal: 5, vertical: 25,
    })}
  >
    <Kebeticon
      color={disabled ? colors.inactive : color}
      style={styles.icon}
      size={18}
      name={iconName}
    />
    {disabled
      ? (
        <Text color="inactive" size="xs" bold text={count.toString()} />
      ) : (
        <ThemedText size="xs" bold text={count.toString()} />
      )}
  </TouchableOpacity>
)

const countReactions = (reactions, post, type) => (
  Object.values(reactions).filter((r) => r.type === type && r.post === post).length
)

const Reactions = ({
  post, author, disabled, onComment,
}) => {
  const posts = useSelector(postsSelector)
  const reactions = useSelector(reactionsSelector)

  const updatedPost = posts[post.id]
  const dispatch = useDispatch()

  const userReaction = Object.values(reactions).find((r) => (
    r.author === author && r.post === post.id
  )) || {}

  const { navigate } = useNavigation()

  const onReaction = useCallback(async (type) => {
    switch (type) {
      case REACTION_TYPES.LIKE:
      case REACTION_TYPES.DISLIKE:
        return dispatch({
          type: types.API_REACT_POST,
          payload: { type, author, postId: post.id },
        })
      case REACTION_TYPES.COMMENT:
        if (onComment) onComment()
        else navigate(routes.COMMENTS, { id: post.id })
        break
      default: break
    }
    return null
  }, [dispatch, post.id, author, onComment, navigate])

  return (
    <View style={styles.reactions}>
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.LIKE ? 'like-fill' : 'like'}
        count={countReactions(reactions, post.id, REACTION_TYPES.LIKE)}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.LIKE)}
      />
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.DISLIKE ? 'dislike-fill' : 'dislike'}
        count={countReactions(reactions, post.id, REACTION_TYPES.DISLIKE)}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.DISLIKE)}
      />
      <Reaction
        iconName="comment"
        count={updatedPost.comments.length}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.COMMENT)}
      />
      <Reaction
        iconName="share"
        count={0}
        disabled={disabled}
        onPress={() => { }}
      />
    </View>
  )
}

export default memo(Reactions)
