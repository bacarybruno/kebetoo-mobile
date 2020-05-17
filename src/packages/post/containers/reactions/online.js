import React, {
  memo, useCallback, useState, useEffect,
} from 'react'
import { View } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import * as api from 'Kebetoo/src/shared/helpers/http'
import routes from 'Kebetoo/src/navigation/routes'

import styles from './styles'
import { Reaction, REACTION_TYPES } from '.'

export const findLiked = ({ post, author }) => post
  .likes
  .find((like) => like.author === author)

export const findCommented = ({ post, author }) => post
  .comments
  .find((comment) => comment.author === author)

export const findDisliked = ({ post, author }) => post
  .dislikes
  .find((dislike) => dislike.author === author)

export const hasLiked = ({ post, author }) => (
  !!findLiked({ post, author })
)

export const hasCommented = ({ post, author }) => (
  !!findCommented({ post, author })
)

export const hasDisliked = ({ post, author }) => (
  !!findDisliked({ post, author })
)

const Reactions = ({
  post: { id: postId }, author, disabled, onComment,
}) => {
  const [post, setPost] = useState({ id: postId })
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [postLikesCount, setPostLikesCount] = useState(0)
  const [postDislikesCount, setPostDislikesCount] = useState(0)
  const [postCommentsCount, setPostCommentsCount] = useState(0)

  const { navigate } = useNavigation()

  const updatePost = useCallback(async () => {
    const updatedPost = await api.getPost(post.id)
    setPost(updatedPost)
  }, [post.id])

  useEffect(() => {
    if (post.likes && post.dislikes && post.comments) {
      setLiked(hasLiked({ post, author }))
      setDisliked(hasDisliked({ post, author }))
      setPostLikesCount(post.likes.length)
      setPostDislikesCount(post.dislikes.length)
      setPostCommentsCount(post.comments.length)
    }
  }, [post, author])

  useFocusEffect(
    useCallback(() => {
      updatePost()
    }, [updatePost]),
  )

  useEffect(() => {
    updatePost()
  }, [liked, disliked, updatePost])

  const like = useCallback(() => {
    setLiked(true)
    setPostLikesCount((value) => value + 1)
    api
      .likePost({ post: post.id, author })
      .catch(() => {
        setLiked(false)
        setPostLikesCount((value) => value - 1)
      })
  }, [post, author])

  const unlike = useCallback(() => {
    const { id } = findLiked({ post, author })
    setLiked(false)
    setPostLikesCount((value) => value - 1)
    api
      .deleteLike(id)
      .catch(() => {
        setLiked(true)
        setPostLikesCount((value) => value + 1)
      })
  }, [post, author])

  const dislike = useCallback(() => {
    setDisliked(true)
    setPostDislikesCount((value) => value + 1)
    api
      .dislikePost({ post: post.id, author })
      .catch(() => {
        setDisliked(false)
        setPostDislikesCount((value) => value - 1)
      })
  }, [post, author])

  const undislike = useCallback(() => {
    const { id } = findDisliked({ post, author })
    setDisliked(false)
    setPostDislikesCount((value) => value - 1)
    api
      .deleteDislike(id)
      .catch(() => {
        setDisliked(true)
        setPostDislikesCount((value) => value + 1)
      })
  }, [post, author])

  const toggleLike = useCallback(() => {
    if (disliked) undislike()
    if (liked) unlike()
    else like()
  }, [disliked, like, liked, undislike, unlike])

  const toggleDislike = useCallback(() => {
    if (liked) unlike()
    if (disliked) undislike()
    else dislike()
  }, [dislike, disliked, liked, undislike, unlike])

  const onReaction = useCallback(async (type) => {
    switch (type) {
      case REACTION_TYPES.LIKE:
        toggleLike()
        break
      case REACTION_TYPES.DISLIKE:
        toggleDislike()
        break
      case REACTION_TYPES.COMMENT:
        if (onComment) onComment()
        else navigate(routes.COMMENTS_ONLINE, { post })
        break
      default: break
    }
    return null
  }, [toggleLike, toggleDislike, onComment, navigate, post])

  return (
    <View style={styles.reactions}>
      <Reaction
        iconName={liked ? 'like-fill' : 'like'}
        count={postLikesCount}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.LIKE)}
      />
      <Reaction
        iconName={disliked ? 'dislike-fill' : 'dislike'}
        count={postDislikesCount}
        disabled={disabled}
        onPress={() => onReaction(REACTION_TYPES.DISLIKE)}
      />
      <Reaction
        iconName="comment"
        count={postCommentsCount}
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
