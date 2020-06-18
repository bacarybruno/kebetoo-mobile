import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import * as api from 'Kebetoo/src/shared/helpers/http'
import routes from 'Kebetoo/src/navigation/routes'

import styles from './styles'
import { Reaction, REACTION_TYPES } from './index'
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

  const onReaction = useCallback(async (type) => {
    switch (type) {
      case REACTION_TYPES.LIKE:
      case REACTION_TYPES.DISLIKE:
        handlePostReaction(type)
        break
      case REACTION_TYPES.COMMENT:
        if (onComment) onComment()
        else navigate(routes.COMMENTS_ONLINE, { post })
        break
      case REACTION_TYPES.SHARE:
        if (post.author !== author) {
          navigate(routes.CREATE_POST, {
            action: actionTypes.SHARE,
            post: post.repost ? post.repost.id : post.id,
          })
        }
        break
      default: break
    }
    return null
  }, [handlePostReaction, onComment, navigate, post, author])

  return (
    <View style={styles.reactions}>
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.LIKE ? 'like-fill' : 'like'}
        count={countReactions(post, REACTION_TYPES.LIKE)}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.LIKE)}
      />
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.DISLIKE ? 'like-fill' : 'like'}
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
