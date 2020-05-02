import React, {
  memo, useCallback, useState, useEffect,
} from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import colors from 'Kebetoo/src/theme/colors'
import EdgeInsets from 'Kebetoo/src/theme/edge-insets'
import routes from 'Kebetoo/src/navigation/routes'
import * as types from 'Kebetoo/src/redux/types'
import { ThemedText } from 'Kebetoo/src/shared/components/text'
import { likesSelector, dislikesSelector, postsSelector } from 'Kebetoo/src/redux/selectors'

import styles from './styles'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
}

export const findLiked = ({ likes, post, author }) => post
  .likes
  .find((like) => likes[like] && likes[like].author === author)

export const findCommented = ({ comments, post, author }) => post
  .comments
  .find((like) => comments[like] && comments[like].author === author)

export const findDisliked = ({ dislikes, post, author }) => post
  .dislikes
  .find((dislike) => dislikes[dislike] && dislikes[dislike].author === author)


export const hasLiked = ({ likes, post, author }) => (
  !!findLiked({ likes, post, author })
)

export const hasCommented = ({ comments, post, author }) => (
  !!findCommented({ comments, post, author })
)

export const hasDisliked = ({ dislikes, post, author }) => (
  !!findDisliked({ dislikes, post, author })
)

export const Reaction = ({
  iconName, count, onPress, color = colors.blue_dark,
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
  post, author, onComment,
}) => {
  const posts = useSelector(postsSelector)
  const likes = useSelector(likesSelector)
  const dislikes = useSelector(dislikesSelector)

  const updatedPost = posts[post.id]

  const [liked, setLiked] = useState(hasLiked({ likes, post, author }))
  const [disliked, setDisliked] = useState(hasDisliked({ dislikes, post, author }))

  const [postLikesCount, setPostLikesCount] = useState(
    (value) => value || post.likes.length,
  )
  const [postDislikesCount, setPostDislikesCount] = useState(
    (value) => value || post.dislikes.length,
  )

  const { navigate, addListener: addNavigationListener } = useNavigation()

  useEffect(() => {
    const unsusbcribeFocus = addNavigationListener('focus', () => {
      setLiked(hasLiked({ likes, post: updatedPost, author }))
      setDisliked(hasDisliked({ dislikes, post: updatedPost, author }))
      setPostLikesCount(updatedPost.likes.length)
      setPostDislikesCount(updatedPost.dislikes.length)
    })
    return unsusbcribeFocus
  }, [addNavigationListener, author, dislikes, likes, updatedPost])

  const dispatch = useDispatch()

  const like = useCallback(() => {
    setLiked(true)
    setPostLikesCount((value) => value + 1)
  }, [])

  const unlike = useCallback(() => {
    setLiked(false)
    setPostLikesCount((value) => value - 1)
  }, [])

  const dislike = useCallback(() => {
    setDisliked(true)
    setPostDislikesCount((value) => value + 1)
  }, [])

  const undislike = useCallback(() => {
    setDisliked(false)
    setPostDislikesCount((value) => value - 1)
  }, [])

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
        return dispatch({
          type: types.API_TOGGLE_LIKE_POST,
          payload: { postId: post.id, author },
        })
      case REACTION_TYPES.DISLIKE:
        toggleDislike()
        return dispatch({
          type: types.API_TOGGLE_DISLIKE_POST,
          payload: { postId: post.id, author },
        })
      case REACTION_TYPES.COMMENT:
        if (onComment) return onComment()
        return navigate(routes.COMMENTS, { id: post.id })
      default: break
    }
    return null
  }, [toggleLike, dispatch, post.id, author, toggleDislike, onComment, navigate])

  return (
    <View style={styles.reactions}>
      <Reaction
        iconName={liked ? 'like-fill' : 'like'}
        count={postLikesCount}
        onPress={() => onReaction(REACTION_TYPES.LIKE)}
      />
      <Reaction
        iconName={disliked ? 'dislike-fill' : 'dislike'}
        count={postDislikesCount}
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
