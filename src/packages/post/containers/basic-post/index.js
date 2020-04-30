import React, { memo, useCallback } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import colors from 'Kebetoo/src/theme/colors'
import Text from 'Kebetoo/src/shared/components/text'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import routes from 'Kebetoo/src/navigation/routes'
import * as types from 'Kebetoo/src/redux/types'
import EdgeInsets from 'Kebetoo/src/theme/edge-insets'
import PostPlaceholder from 'Kebetoo/src/shared/components/placeholders/posts'

import styles from './styles'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
}

const isUpdated = (post) => post.createdAt !== post.updatedAt

const ThemedText = (props) => (
  <Text {...props} color="blue_dark" />
)

const Edited = ({ size }) => (
  <>
    <ThemedText size={size} text=" • " />
    <ThemedText size={size} text="Edited" />
  </>
)

export const hasLiked = ({ post, author }) => post
  .likes
  .some((like) => like.author === author.id)

export const hasCommented = ({ post, author }) => post
  .comments
  .some((comment) => comment.author === author.id)

export const hasDisliked = ({ post, author }) => post
  .dislikes
  .some((dislike) => dislike.author === author.id)

export const Header = ({
  post, author, size, Left,
}) => (
  <View style={styles.header}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Left && <Left />}
      <Avatar src={author.photoURL} text={author.displayName} size={size} />
    </View>
    <View style={[styles.meta, { height: size }]}>
      <ThemedText size="sm" text={author.displayName} />
      <View style={styles.smallMeta}>
        <ThemedText size="xs" text={moment(post.createdAt).fromNow()} />
        {isUpdated(post) && <Edited size="xs" />}
      </View>
    </View>
  </View>
)

export const Content = ({ post, style }) => (
  <View style={[styles.content, style]}>
    <ThemedText text={post.content} />
  </View>
)

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

export const Reactions = ({ post, author, onReaction }) => {
  const liked = hasLiked({ post, author })
  const disliked = hasDisliked({ post, author })
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

const BasicPost = ({ post, author, size = 35 }) => {
  const dispatch = useDispatch()
  const { navigate } = useNavigation()

  const onReaction = useCallback(async (type) => {
    switch (type) {
      case REACTION_TYPES.LIKE:
        dispatch({
          type: types.API_TOGGLE_LIKE_POST,
          payload: { post, author },
        })
        break
      case REACTION_TYPES.DISLIKE:
        dispatch({
          type: types.API_TOGGLE_DISLIKE_POST,
          payload: { post, author },
        })
        break
      case REACTION_TYPES.COMMENT:
        navigate(routes.COMMENTS, { id: post.id })
        break
      default: break
    }
  }, [author, post, dispatch, navigate])

  if (!author) return <PostPlaceholder />
  return (
    <View style={styles.wrapper}>
      <Header post={post} author={author} size={size} />
      <Content post={post} />
      <Reactions post={post} author={author} onReaction={onReaction} />
    </View>
  )
}

export default memo(BasicPost)
