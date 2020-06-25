import React, { useCallback } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import dayjs from 'dayjs'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

import Avatar from 'Kebetoo/src/shared/components/avatar'
import PostPlaceholder, { PlaceholderAvatar } from 'Kebetoo/src/shared/components/placeholders/posts'
import Reactions from 'Kebetoo/src/packages/post/containers/reactions'
import TextContent from 'Kebetoo/src/packages/post/components/text-content'
import AudioContent from 'Kebetoo/src/packages/post/components/audio-content'
import ImageContent from 'Kebetoo/src/packages/post/components/image-content'
import RepostContent from 'Kebetoo/src/packages/post/components/repost-content'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import routes from 'Kebetoo/src/navigation/routes'
import { ThemedText, fontSizes } from 'Kebetoo/src/shared/components/text'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'

const isUpdated = (post) => post.createdAt !== post.updatedAt

export const POST_TYPES = {
  AUDIO: 'audio',
  IMAGE: 'image',
  TEXT: 'text',
  REPOST: 'repost',
}

export const getPostType = (post) => {
  if (post.repost) {
    return POST_TYPES.REPOST
  }
  if (post.audio && post.audio.url) {
    return POST_TYPES.AUDIO
  }
  if (post.image && post.image.url) {
    return POST_TYPES.IMAGE
  }
  if (post.content && post.content.length > 0) {
    return POST_TYPES.TEXT
  }
  return null
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
  post, isRepost, author, size, onOptions, Left,
}) => {
  let avatarSize = size
  if (isRepost) avatarSize = fontSizes.lg
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.left}>
        <View style={styles.headerContent}>
          {Left && <Left />}
          {author ? (
            <Avatar src={author.photoURL} text={author.displayName} size={avatarSize} />
          ) : (
            <PlaceholderAvatar size={avatarSize} />
          )}
        </View>
        {author && (
          <View style={[styles.meta, { height: avatarSize }, isRepost && styles.repostMeta]}>
            <ThemedText size={isRepost ? 'sm' : 'md'} text={author.displayName} />
            {!isRepost && (
              <View style={styles.smallMeta}>
                <ThemedText size="xs" text={dayjs(post.createdAt).fromNow()} />
                {isUpdated(post) && <Edited size="xs" />}
              </View>
            )}
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
}

export const Content = ({ post, ...otherProps }) => {
  const postType = getPostType(post)
  switch (postType) {
    case POST_TYPES.AUDIO:
      return (
        <AudioContent
          content={post.content}
          audioName={post.audio.name}
          audioUrl={post.audio.url}
          {...otherProps}
        />
      )
    case POST_TYPES.IMAGE:
      return <ImageContent content={post.content} url={post.image.url} {...otherProps} />
    case POST_TYPES.REPOST:
      return <RepostContent post={post} {...otherProps} />
    case POST_TYPES.TEXT:
      return <TextContent content={post.content} {...otherProps} />
    default: return null
  }
}

const BasicPost = ({
  post, author, originalAuthor, onOptions, isRepost, size = 35, withReactions = true,
}) => {
  const user = auth().currentUser
  const { navigate } = useNavigation()

  const navigateToComments = useCallback(() => {
    navigate(routes.COMMENTS, { post })
  }, [navigate, post])

  if (!author) return <PostPlaceholder withReactions={withReactions} avatarSize={size} />

  return (
    <View style={[styles.wrapper, isRepost && styles.noMargin]}>
      <Header isRepost={isRepost} post={post} author={author} size={size} onOptions={onOptions} />
      <Content
        onPress={isRepost ? null : navigateToComments}
        originalAuthor={originalAuthor}
        post={post}
      />
      {withReactions && (
        <View style={styles.reactions}>
          <Reactions post={post} author={user.uid} />
        </View>
      )}
    </View>
  )
}

const propsAreEqual = (prevProps, nextProps) => (
  prevProps.post.updatedAt === nextProps.post.updatedAt
  && prevProps.withReactions && nextProps.withReactions
  && prevProps.author && nextProps.author
  && prevProps.author.id === nextProps.author.id
  && prevProps.post.comments.length === nextProps.post.comments.length
)
export default React.memo(BasicPost, propsAreEqual)
