import React, { memo, useCallback } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import dayjs from 'dayjs'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth'

import Avatar from 'Kebetoo/src/shared/components/avatar'
import PostPlaceholder from 'Kebetoo/src/shared/components/placeholders/posts'
import Reactions from 'Kebetoo/src/packages/post/containers/reactions'
import ReactionsOnline from 'Kebetoo/src/packages/post/containers/reactions/online'
import TextContent from 'Kebetoo/src/packages/post/components/text-content'
import AudioContent from 'Kebetoo/src/packages/post/components/audio-content'
import ImageContent from 'Kebetoo/src/packages/post/components/image-content'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import routes from 'Kebetoo/src/navigation/routes'
import { ThemedText, fontSizes } from 'Kebetoo/src/shared/components/text'
import { postsSelector } from 'Kebetoo/src/redux/selectors'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'

const isUpdated = (post) => post.createdAt !== post.updatedAt

export const POST_TYPES = {
  AUDIO: 'audio',
  IMAGE: 'image',
  TEXT: 'text',
}

export const getPostType = (post) => {
  if (post.audio && post.audio.url) {
    return POST_TYPES.AUDIO
  }
  if (post.image && post.image.url) {
    return POST_TYPES.IMAGE
  }
  return POST_TYPES.TEXT
}

const Edited = ({ size }) => (
  <>
    <ThemedText size={size} text=" • " />
    <ThemedText size={size} text={strings.general.edited} />
  </>
)

const MoreButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.moreButton}
    hitSlop={edgeInsets.all(50)}
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
        {author && (
          <Avatar src={author.photoURL} text={author.displayName} size={size} />
        )}
      </View>
      {author && (
        <View style={[styles.meta, { height: size }]}>
          <ThemedText size="md" text={author.displayName} />
          <View style={styles.smallMeta}>
            <ThemedText size="xs" text={dayjs(post.createdAt).fromNow()} />
            {isUpdated(post) && <Edited size="xs" />}
          </View>
        </View>
      )}
    </View>
    {onOptions && (
      <View style={styles.moreButton}>
        <MoreButton onPress={() => onOptions(post.id)} />
      </View>
    )}
  </View>
)

export const Content = ({ post, ...otherProps }) => {
  const postType = getPostType(post)
  switch (postType) {
    case POST_TYPES.AUDIO:
      return <AudioContent post={post} {...otherProps} />
    case POST_TYPES.IMAGE:
      return <ImageContent post={post} {...otherProps} />
    default:
      return <TextContent post={post} {...otherProps} />
  }
}

const BasicPost = ({
  post, author, onOptions, size = 35,
}) => {
  const user = auth().currentUser
  const { navigate } = useNavigation()
  const posts = useSelector(postsSelector)

  const navigateToComments = useCallback(() => {
    navigate(routes.COMMENTS, { id: post.id })
  }, [navigate, post.id])

  if (!author) return <PostPlaceholder />

  const ReactionsComponent = posts[post.id] ? Reactions : ReactionsOnline

  return (
    <View style={styles.wrapper}>
      <Header post={post} author={author} size={size} onOptions={onOptions} />
      <Content onPress={navigateToComments} post={post} />
      <ReactionsComponent post={post} author={user.uid} />
    </View>
  )
}

export default memo(BasicPost)
