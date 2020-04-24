import React, { memo, useCallback } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from 'Kebetoo/src/theme/colors'
import Text from 'Kebetoo/src/shared/components/text'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import * as types from 'Kebetoo/src/redux/types'

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

export const Header = ({ post, author, size }) => (
  <View style={styles.header}>
    <Avatar src={author.photoURL} text={author.displayName} size={size} />
    <View style={[styles.meta, { height: size }]}>
      <ThemedText size="sm" text={author.displayName} />
      <View style={styles.smallMeta}>
        <ThemedText size="xs" text={moment(post.createdAt).fromNow()} />
        {isUpdated(post) && <Edited size="xs" />}
      </View>
    </View>
  </View>
)

export const Content = ({ post }) => (
  <View style={styles.content}>
    <ThemedText text={post.content} />
  </View>
)

export const Reaction = ({
  iconName,
  count,
  onPress,
  color = colors.blue_dark,
  IconSet = MaterialCommunityIcon,
}) => (
  <TouchableOpacity style={styles.reaction} onPress={onPress}>
    <IconSet color={color} style={styles.icon} size={20} name={iconName} />
    <ThemedText size="xs" bold text={count.toString()} />
  </TouchableOpacity>
)

export const Reactions = ({ post, author, onReaction }) => (
  <View style={styles.reactions}>
    <Reaction
      iconName={hasLiked({ post, author }) ? 'thumb-up' : 'thumb-up-outline'}
      count={post.likes.length}
      onPress={() => onReaction(REACTION_TYPES.LIKE)}
    />
    <Reaction
      iconName={hasDisliked({ post, author }) ? 'thumb-down' : 'thumb-down-outline'}
      count={post.dislikes.length}
      onPress={() => onReaction(REACTION_TYPES.DISLIKE)}
    />
    <Reaction
      iconName={hasCommented({ post, author }) ? 'comment-text' : 'comment-text-outline'}
      count={post.comments.length}
      onPress={() => onReaction(REACTION_TYPES.COMMENT)}
    />
    <Reaction
      iconName="share-outline"
      count={0}
      onPress={() => { }}
    />
  </View>
)

const Placeholder = () => null

const BasicPost = ({ post, author, size = 35 }) => {
  const dispatch = useDispatch()
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
        // await commentPost({ post: post.id, author: author.id })
        break
      default: break
    }
  }, [author, post, dispatch])

  if (!author) return <Placeholder />
  return (
    <View style={styles.wrapper}>
      <Header post={post} author={author} size={size} />
      <Content post={post} />
      <Reactions post={post} author={author} onReaction={onReaction} />
    </View>
  )
}

export default memo(BasicPost)
