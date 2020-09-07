import React, { useCallback } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import dayjs from 'dayjs'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

import Typography, { types, fontSizes, weights } from 'Kebetoo/src/shared/components/typography'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import PostPlaceholder, { PlaceholderAvatar } from 'Kebetoo/src/shared/components/placeholders/posts'
import Reactions from 'Kebetoo/src/features/post/containers/reactions'
import TextContent from 'Kebetoo/src/features/post/components/text-content'
import AudioContent from 'Kebetoo/src/features/post/components/audio-content'
import ImageContent from 'Kebetoo/src/features/post/components/image-content'
import RepostContent from 'Kebetoo/src/features/post/components/repost-content'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import routes from 'Kebetoo/src/navigation/routes'
import strings from 'Kebetoo/src/config/strings'
import colors from 'Kebetoo/src/theme/colors'
import useUser from 'Kebetoo/src/shared/hooks/user'

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

const Edited = () => (
  <>
    <Typography text=" • " type={types.caption} />
    <Typography text={strings.general.edited} type={types.caption} />
  </>
)

const MoreButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.moreButton}
    hitSlop={edgeInsets.all(50)}
    testID="more-button"
  >
    <Ionicon
      name={Platform.select({ android: 'md-more', ios: 'ios-more' })}
      size={fontSizes.lg}
      color={colors.textTertiary}
    />
  </TouchableOpacity>
)

export const Header = ({
  post, isRepost, author, size, onOptions, Left,
}) => {
  let avatarSize = size
  if (isRepost) avatarSize = fontSizes.lg

  const { navigate } = useNavigation()

  const onShowProfile = useCallback(() => {
    navigate(routes.USER_PROFILE, { userId: author.id })
  }, [author.id, navigate])

  return (
    <View style={[styles.headerWrapper, isRepost && styles.repostHeaderWrapper]}>
      <View style={styles.left}>
        <View style={styles.headerContent}>
          {Left && <Left />}
          {author ? (
            <TouchableOpacity onPress={onShowProfile}>
              <Avatar src={author.photoURL} text={author.displayName} size={avatarSize} />
            </TouchableOpacity>
          ) : (
            <PlaceholderAvatar size={avatarSize} />
          )}
        </View>
        {author && (
          <View style={[styles.meta, { height: avatarSize }, isRepost && styles.repostMeta]}>
            <Typography
              text={author.displayName}
              type={types.textButton}
              systemWeight={weights.semibold}
            />
            {!isRepost && (
              <View style={styles.smallMeta}>
                <Typography text={dayjs(post.createdAt).fromNow()} type={types.caption} />
                {isUpdated(post) && <Edited />}
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
  post, author, originalAuthor, onOptions, isRepost, mode, size = 35, withReactions = true,
}) => {
  const { navigate } = useNavigation()

  const { profile } = useUser()

  const navigateToComments = useCallback(() => {
    navigate(routes.COMMENTS, { post })
  }, [navigate, post])

  if (!author) return <PostPlaceholder withReactions={withReactions} avatarSize={size} />

  return (
    <View style={[styles.wrapper, isRepost && styles.noMargin]}>
      <Header isRepost={isRepost} post={post} author={author} size={size} onOptions={onOptions} />
      <Content
        onPress={isRepost ? undefined : navigateToComments}
        originalAuthor={originalAuthor}
        post={post}
        isRepost={isRepost}
        mode={mode}
      />
      {withReactions && (
        <View style={styles.reactions}>
          <Reactions post={post} author={profile.uid} />
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
