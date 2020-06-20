import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Ionicon from 'react-native-vector-icons/Ionicons'

import * as api from 'Kebetoo/src/shared/helpers/http'
import routes from 'Kebetoo/src/navigation/routes'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'
import { Reaction, REACTION_TYPES, bottomSheetItems } from './index'
import { actionTypes } from '../create'

const countReactions = (post, type) => (
  post.reactions.filter((r) => r.type === type && r.post === post.id).length
)

const Reactions = ({
  post: { id: postId }, author, disabled, onComment,
}) => {
  const [post, setPost] = useState({
    id: postId,
    reactions: [],
    comments: [],
  })

  const { showActionSheetWithOptions } = useActionSheet()
  const { navigate } = useNavigation()

  const userReaction = post.reactions.find((r) => (
    r.author === author && r.post === post.id
  )) || {}

  const updatePost = useCallback(async () => {
    const updatedPost = await api.getPost(post.id)
    setPost(updatedPost)
  }, [post.id])

  useFocusEffect(
    useCallback(() => {
      updatePost()
    }, [updatePost]),
  )

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
        handlePostReaction(type)
        break
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
        count={post.comments.length}
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
