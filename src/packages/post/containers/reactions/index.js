import React, { useCallback, useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import colors from 'Kebetoo/src/theme/colors'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import routes from 'Kebetoo/src/navigation/routes'
import Text, { ThemedText } from 'Kebetoo/src/shared/components/text'
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

const countReactions = (post, type) => (
  post.reactions.filter((r) => r.type === type).length
)

const Reactions = ({
  post: givenPost, author, comments, disabled, onComment,
}) => {
  const [post, setPost] = useState(givenPost)
  const [dirty, setDirty] = useState(false)

  const { showActionSheetWithOptions } = useActionSheet()
  const { navigate, addListener: addNavigationListener } = useNavigation()

  const userReaction = post.reactions.find((r) => r.author === author) || {}

  const updatePost = useCallback(async () => {
    const updatedPost = await api.getPost(post.id)
    setPost(updatedPost)
    setDirty(false)
  }, [post.id])

  useEffect(() => {
    const unsusbcribeFocus = addNavigationListener('focus', () => {
      if (dirty) updatePost()
    })
    return unsusbcribeFocus
  }, [addNavigationListener, dirty, updatePost])

  const handlePostReaction = useCallback(async (type) => {
    const reaction = post.reactions.find((r) => (
      r.author === author && r.post === post.id
    ))
    if (reaction === undefined) {
      const result = await api.createReaction(type, post.id, author)
      result.post = result.post.id
      post.reactions.push(result)
    } else if (reaction.type === type) {
      await api.deleteReaction(reaction.id)
      post.reactions = post.reactions.filter((r) => r.id !== reaction.id)
    } else {
      const result = await api.editReaction(reaction.id, type)
      result.post = result.post.id
      post.reactions = [
        ...post.reactions.filter((r) => r.id !== reaction.id),
        result,
      ]
    }
    setPost({ ...post })
  }, [post, author])

  const handlePostShare = useCallback(() => {
    if (post.author !== author || (post.repost?.author !== author)) {
      const repostId = post.repost?.id || post.id
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
        handlePostReaction(type)
        break
      case REACTION_TYPES.COMMENT:
        if (onComment) {
          onComment()
        } else {
          navigate(routes.COMMENTS, { post })
          setDirty(true)
        }
        break
      case REACTION_TYPES.SHARE:
        handlePostShare()
        break
      default: break
    }
    return null
  }, [handlePostReaction, onComment, navigate, post, handlePostShare])

  return (
    <View style={styles.reactions}>
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.LIKE ? 'like-fill' : 'like'}
        color={userReaction.type === REACTION_TYPES.LIKE ? 'like' : undefined}
        count={countReactions(post, REACTION_TYPES.LIKE)}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.LIKE)}
      />
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.DISLIKE ? 'like-fill' : 'like'}
        color={userReaction.type === REACTION_TYPES.DISLIKE ? 'dislike' : undefined}
        count={countReactions(post, REACTION_TYPES.DISLIKE)}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.DISLIKE)}
      />
      <Reaction
        iconName="comment"
        count={comments?.length || post.comments.length}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.COMMENT)}
      />
      <Reaction
        iconName="share"
        count={post.reposts?.length || 0}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.SHARE)}
      />
    </View>
  )
}

export default React.memo(Reactions)
