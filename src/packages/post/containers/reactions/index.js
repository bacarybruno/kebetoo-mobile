import React, { useCallback } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import colors from 'Kebetoo/src/theme/colors'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import routes from 'Kebetoo/src/navigation/routes'
import * as types from 'Kebetoo/src/redux/types'
import Text, { ThemedText } from 'Kebetoo/src/shared/components/text'
import { reactionsSelector } from 'Kebetoo/src/redux/selectors'
import strings from 'Kebetoo/src/config/strings'
import * as api from 'Kebetoo/src/shared/helpers/http'

import styles from './styles'
import { actionTypes } from '../create'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
  LOVE: 'love',
  SHARE: 'share',
}

export const bottomSheetItems = [{
  title: strings.reactions.share_now,
  icon: 'ios-share-alt',
}, {
  title: strings.reactions.write_post,
  icon: 'ios-share',
}, {
  title: strings.general.cancel,
  icon: 'md-close',
}]

export const Reaction = ({
  iconName, count, onPress, disabled, color = 'reactions',
}) => (
  <TouchableOpacity
    style={styles.reaction}
    onPress={onPress}
    disabled={disabled}
    hitSlop={edgeInsets.symmetric({ horizontal: 5, vertical: 10 })}
  >
    <Kebeticon
      color={colors[color]}
      style={styles.icon}
      size={18}
      name={iconName}
    />
    {disabled
      ? (
        <Text color="inactive" size="xs" bold text={count.toString()} />
      ) : (
        <ThemedText size="xs" bold text={count.toString()} color={color} />
      )}
  </TouchableOpacity>
)

const countReactions = (reactions, post, type) => (
  Object.values(reactions).filter((r) => r.type === type && r.post === post).length
)

const Reactions = ({
  post, comments, author, disabled, onComment,
}) => {
  const reactions = useSelector(reactionsSelector)
  const dispatch = useDispatch()

  const { showActionSheetWithOptions } = useActionSheet()
  const { navigate } = useNavigation()

  const findUserReaction = useCallback((reaction) => (
    reaction.post === post.id && reaction.author === author
  ), [author, post.id])

  const userReaction = Object.values(reactions).find(findUserReaction) || {}

  const handlePostShare = useCallback(() => {
    if (post.author !== author || (post.repost && post.repost.author !== author)) {
      const repostId = post.repost ? post.repost.id : post.id
      const cancelButtonIndex = 2
      showActionSheetWithOptions({
        options: bottomSheetItems.map((item) => item.title),
        icons: bottomSheetItems.map((item) => (
          <Ionicon name={item.icon} size={24} />
        )),
        cancelButtonIndex,
        title: strings.general.share,
      }, async (index) => {
        if (index === 0) {
          await api.createPost({ author, repost: repostId })
        } else if (index === 1) {
          navigate(routes.CREATE_POST, {
            action: actionTypes.SHARE,
            post: repostId,
          })
        }
      })
    }
  }, [author, navigate, post, showActionSheetWithOptions])

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
        else navigate(routes.COMMENTS, { post })
        break
      case REACTION_TYPES.SHARE:
        handlePostShare()
        break
      default: break
    }
    return null
  }, [dispatch, author, post, onComment, navigate, handlePostShare])

  return (
    <View style={styles.reactions}>
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.LIKE ? 'like-fill' : 'like'}
        color={userReaction.type === REACTION_TYPES.LIKE ? 'like' : undefined}
        count={countReactions(reactions, post.id, REACTION_TYPES.LIKE)}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.LIKE)}
      />
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.DISLIKE ? 'dislike-fill' : 'dislike'}
        color={userReaction.type === REACTION_TYPES.DISLIKE ? 'dislike' : undefined}
        count={countReactions(reactions, post.id, REACTION_TYPES.DISLIKE)}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.DISLIKE)}
      />
      <Reaction
        iconName="comment"
        count={comments ? comments.length : post.comments.length}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.COMMENT)}
      />
      <Reaction
        iconName="share"
        count={post.reposts ? post.reposts.length : 0}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.SHARE)}
      />
    </View>
  )
}

export default React.memo(Reactions)
