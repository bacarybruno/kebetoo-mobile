/* eslint-disable radix */
import React, { useCallback, useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Kebeticon from '@app/shared/icons/kebeticons'
import colors, { rgbaToHex } from '@app/theme/colors'
import edgeInsets from '@app/theme/edge-insets'
import routes from '@app/navigation/routes'
import Typography, { types, weights } from '@app/shared/components/typography'
import strings from '@app/config/strings'
import * as api from '@app/shared/helpers/http'

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
  iconName, count, onPress, color = 'reactions', ...otherProps
}) => (
  <TouchableOpacity
    style={styles.reaction}
    onPress={onPress}
    hitSlop={edgeInsets.symmetric({ horizontal: 5, vertical: 10 })}
    {...otherProps}
  >
    <Kebeticon color={colors[color]} style={styles.icon} size={18} name={iconName} />
    <Typography type={types.headline6} systemWeight={weights.bold} text={count} color={color} />
  </TouchableOpacity>
)

const countReactions = (post, type) => (
  post.reactions.filter((r) => r.type === type).length
)

const Reactions = ({
  post: givenPost, author, comments, onComment,
}) => {
  const [post, setPost] = useState(givenPost)
  const [dirty, setDirty] = useState(false)

  const { showActionSheetWithOptions } = useActionSheet()
  const { navigate, addListener: addNavigationListener } = useNavigation()

  const findUserReaction = useCallback((reaction) => reaction.author === author, [author])

  const userReaction = post.reactions.find(findUserReaction) || {}

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

  const createReaction = useCallback(async (type) => {
    // create random negative id
    const optimisticId = parseInt(Math.random() * -1000000)

    // display a reaction with expected value and a fake id
    const optimisticPost = {
      ...post,
      reactions: [
        ...post.reactions,
        { id: optimisticId, type, author },
      ],
    }
    setPost(optimisticPost)

    // create the reaction on the backend
    api.createReaction(type, post.id, author)
      .then((res) => {
        // replace the fake reaction created with the new one
        const result = res
        result.post = result.post.id
        result.author = result.author.id
        optimisticPost.reactions = [
          ...optimisticPost.reactions.filter((reaction) => reaction.id !== optimisticId),
          result,
        ]
        // update post to trigger re-render
        setPost({ ...optimisticPost })
      }).catch(() => {
        // rollback the operation
        optimisticPost.reactions = optimisticPost.reactions.filter((r) => r.id !== optimisticId)
        setPost({ ...optimisticPost })
      })
  }, [author, post])

  const deleteReaction = useCallback(async (reactionId) => {
    // don't do anything if reactionId is not a valid ID
    if (parseInt(reactionId) < 0) return

    // remove reaction from state
    const optimisticPost = { ...post }
    const deletedReaction = optimisticPost.reactions.find((r) => r.id === reactionId)
    optimisticPost.reactions = optimisticPost.reactions.filter((r) => r.id !== reactionId)
    setPost(optimisticPost)

    // then remove it from the backend
    api.deleteReaction(reactionId).catch(() => {
      // operation failed => rollback the operation
      optimisticPost.reactions = [
        ...optimisticPost.reactions,
        deletedReaction,
      ]
      setPost({ ...optimisticPost })
    })
  }, [post])

  const editReaction = useCallback(async (type, reactionId) => {
    // don't do anything if reactionId is not a valid ID
    if (parseInt(reactionId) < 0) return

    // find the reaction to edit and change the type
    const optimisticPost = { ...post }
    const editedReaction = optimisticPost.reactions.find((r) => r.id === reactionId)
    const editedReactionBaseType = editedReaction.type
    editedReaction.type = type

    // add the reaction in the state to trigger re-render
    optimisticPost.reactions = [
      ...optimisticPost.reactions.filter((r) => r.id !== reactionId),
      editedReaction,
    ]
    setPost({ ...optimisticPost })

    // then edit it from the backend
    api.editReaction(reactionId, type).catch(() => {
      // operation failed => rollback the operation
      editedReaction.type = editedReactionBaseType
      optimisticPost.reactions = [
        ...optimisticPost.reactions.filter((r) => r.id !== reactionId),
        editedReaction,
      ]
      setPost({ ...optimisticPost })
    })
  }, [post])

  const handlePostReaction = useCallback(async (type) => {
    const reaction = post.reactions.find(findUserReaction)
    if (reaction === undefined) {
      await createReaction(type)
    } else if (reaction.type === type) {
      await deleteReaction(reaction.id)
    } else {
      await editReaction(type, reaction.id)
    }
  }, [post.reactions, findUserReaction, createReaction, deleteReaction, editReaction])

  const handlePostShare = useCallback(() => {
    if (post.author.id === author) return
    // if ((post.repost?.author === author) === true) return
    const repostId = post.repost?.id || post.id
    const cancelButtonIndex = 2
    showActionSheetWithOptions({
      options: bottomSheetItems.map((item) => item.title),
      icons: bottomSheetItems.map((item) => (
        <Ionicon name={item.icon} size={24} color={colors.textPrimary} />
      )),
      cancelButtonIndex,
      title: strings.general.share,
      textStyle: { color: colors.textPrimary },
      titleTextStyle: { color: colors.textSecondary },
      containerStyle: { backgroundColor: rgbaToHex(colors.backgroundSecondary) },
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
        onPress={() => onReaction(REACTION_TYPES.LIKE)}
        testID="like-button"
      />
      <Reaction
        iconName={userReaction.type === REACTION_TYPES.DISLIKE ? 'dislike-fill' : 'dislike'}
        color={userReaction.type === REACTION_TYPES.DISLIKE ? 'dislike' : undefined}
        count={countReactions(post, REACTION_TYPES.DISLIKE)}
        onPress={() => onReaction(REACTION_TYPES.DISLIKE)}
        testID="dislike-button"
      />
      <Reaction
        iconName="comment"
        count={comments?.length || post.comments.length}
        onPress={() => onReaction(REACTION_TYPES.COMMENT)}
        testID="comment-button"
      />
      <Reaction
        iconName="share"
        count={post.reposts?.length || 0}
        onPress={() => onReaction(REACTION_TYPES.SHARE)}
        testID="share-button"
      />
    </View>
  )
}

export default React.memo(Reactions)
