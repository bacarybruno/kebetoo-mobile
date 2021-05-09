/* eslint-disable radix */
import { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import routes from '@app/navigation/routes'
import { strings } from '@app/config'
import { api } from '@app/shared/services'
import { useAnalytics, useBottomSheet } from '@app/shared/hooks'

import { actionTypes } from '../containers/create'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
  LOVE: 'love',
  SHARE: 'share',
}

export const bottomSheetItems = [{
  title: strings.reactions.share_now,
  icon: 'git-compare-outline',
}, {
  title: strings.reactions.write_post,
  icon: 'create-outline',
}, {
  title: strings.general.cancel,
  icon: 'close-outline',
}]

export const countReactions = (post, type) => (
  post.reactions.filter((r) => r.type === type).length
)

const useReactions = ({
  post: givenPost, author, comments, onComment,
}) => {
  const [post, setPost] = useState(givenPost)

  useEffect(() => {
    setPost({ ...givenPost })
  }, [givenPost])

  const { showSharePostOptions } = useBottomSheet()
  const { navigate } = useNavigation()
  const { trackSelectPost } = useAnalytics()

  const findUserReaction = useCallback((reaction) => reaction.author === author, [author])

  const userReaction = post.reactions.find(findUserReaction) || {}

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
    setPost({ ...optimisticPost })

    // create the reaction on the backend
    api.reactions.create(type, post.id, author)
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
    setPost({ ...optimisticPost })

    // then remove it from the backend
    api.reactions.delete(reactionId).catch(() => {
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
    api.reactions.update(reactionId, type).catch(() => {
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

  const handlePostShare = useCallback(async () => {
    if (post.author.id === author) return
    const actionIndex = await showSharePostOptions()

    // if ((post.repost?.author === author) === true) return
    const repostId = post.repost?.id || post.id
    if (actionIndex === 0) {
      await api.posts.create({ author, repost: repostId })
      navigate(routes.MANAGE_POSTS)
    } else if (actionIndex === 1) {
      navigate(routes.CREATE_POST, {
        action: actionTypes.SHARE,
        post: repostId,
      })
    }
  }, [author, navigate, post, showSharePostOptions])

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
          trackSelectPost(post.id)
        }
        break
      case REACTION_TYPES.SHARE:
        handlePostShare()
        break
      default: break
    }
    return null
  }, [handlePostReaction, onComment, navigate, post, handlePostShare, trackSelectPost])

  return {
    onReaction,
    userReactionType: userReaction.type,
    count: {
      likes: countReactions(post, REACTION_TYPES.LIKE),
      dislikes: countReactions(post, REACTION_TYPES.DISLIKE),
      comments: (comments || post.comments).length,
      shares: post.reposts?.length ?? 0,
    },
  }
}

export default useReactions
