import React, { memo, useCallback } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import moment from 'moment'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

import { ThemedText, fontSizes } from 'Kebetoo/src/shared/components/text'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import PostPlaceholder from 'Kebetoo/src/shared/components/placeholders/posts'
import Reactions from 'Kebetoo/src/packages/post/containers/reactions'
import ReactionsOnline from 'Kebetoo/src/packages/post/containers/reactions/online'
import EdgeInsets from 'Kebetoo/src/theme/edge-insets'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import routes from 'Kebetoo/src/navigation/routes'
import { postsSelector } from 'Kebetoo/src/redux/selectors'

import styles from './styles'

const isUpdated = (post) => post.createdAt !== post.updatedAt

const Edited = ({ size }) => (
  <>
    <ThemedText size={size} text=" • " />
    <ThemedText size={size} text="Edited" />
  </>
)

const MoreButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.moreButton}
    hitSlop={EdgeInsets.all(50)}
  >
    <Ionicon
      name={Platform.select({ android: 'md-more', ios: 'ios-more' })}
      size={fontSizes.lg}
    />
  </TouchableOpacity>
)

export const Header = ({
  post, author, size, onOptions, Left,
}) => (
  <View style={styles.headerWrapper}>
    <View style={styles.left}>
      <View style={{ flexDirection: 'row' }}>
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
    {onOptions && (
      <View style={styles.moreButton}>
        <MoreButton onPress={() => onOptions(post.id)} />
      </View>
    )}
  </View>
)

export const Content = ({ post, style, onPress, disabled }) => (
  <Pressable
    onPress={() => onPress(post)}
    disabled={disabled || !onPress}
    style={[styles.content, style]}
  >
    <ThemedText text={post.content} />
  </Pressable>
)


const BasicPost = ({ post, author, onOptions, disabled, size = 35 }) => {
  const { navigate } = useNavigation()
  const posts = useSelector(postsSelector)

  const navigateToComments = useCallback(({ id }) => {
    navigate(routes.COMMENTS, { id })
  }, [])

  if (!author) return <PostPlaceholder />

  const ReactionsComponent = posts[post.id] ? Reactions : ReactionsOnline
  return (
    <View style={styles.wrapper}>
      <Header
        post={post}
        author={author}
        size={size}
        onOptions={onOptions} />
      <Content post={post} onPress={navigateToComments} disabled={disabled} />
      <ReactionsComponent post={post} author={author.id} disabled={disabled} />
    </View>
  )
}

export default memo(BasicPost)
