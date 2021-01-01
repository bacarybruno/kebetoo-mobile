import React, { useCallback } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import dayjs from 'dayjs'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

import {
  Avatar, Typography, PostPlaceholder, Badge,
} from '@app/shared/components'
import { PlaceholderAvatar } from '@app/shared/components/placeholders/posts'
import Reactions from '@app/features/post/containers/reactions'
import AudioContent from '@app/features/post/components/audio-content'
import ImageContent from '@app/features/post/components/image-content'
import VideoContent from '@app/features/post/components/video-content'
import routes from '@app/navigation/routes'
import { strings } from '@app/config'
import { edgeInsets } from '@app/theme'
import { useAnalytics, useAppColors, useUser } from '@app/shared/hooks'
import TextContent from '@app/features/post/components/text-content'
import RepostContent from '@app/features/post/components/repost-content'

import styles from './styles'

const isUpdated = (post) => post.createdAt?.split('.')[0] !== post.updatedAt?.split('.')[0]

export const POST_TYPES = {
  AUDIO: 'audio',
  IMAGE: 'image',
  TEXT: 'text',
  REPOST: 'repost',
  VIDEO: 'video',
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
  if (post.video && post.video.url) {
    return POST_TYPES.VIDEO
  }
  if (post.content && post.content.length > 0) {
    return POST_TYPES.TEXT
  }
  return null
}

const Edited = () => (
  <>
    <Typography text=" • " type={Typography.types.caption} />
    <Typography text={strings.general.edited} type={Typography.types.caption} />
  </>
)

const InfoBadge = ({ text }) => (
  <>
    <Typography text=" • " type={Typography.types.caption} />
    <Badge text={text} typography={Typography.types.caption} primary />
  </>
)

const MoreButton = ({ onPress }) => {
  const { colors } = useAppColors()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.moreButton}
      hitSlop={edgeInsets.all(50)}
      testID="more-button"
    >
      <Ionicon
        name={Platform.select({ android: 'md-more', ios: 'ios-more' })}
        size={Typography.fontSizes.lg}
        color={colors.textTertiary}
      />
    </TouchableOpacity>
  )
}

export const Header = ({
  post, isRepost, author, size, onOptions, Left, badge,
}) => {
  let avatarSize = size
  if (isRepost) avatarSize = Typography.fontSizes.lg

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
              type={Typography.types.textButton}
              systemWeight={Typography.weights.semibold}
            />
            {!isRepost && (
              <View style={styles.smallMeta}>
                <Typography
                  text={dayjs(post.createdAt).fromNow()}
                  type={Typography.types.caption}
                />
                {isUpdated(post) && <Edited />}
                {badge && <InfoBadge text={badge} />}
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
    case POST_TYPES.VIDEO:
      return (
        <VideoContent
          content={post.content}
          videoName={post.video.name}
          videoUrl={post.video.url}
          localFileUri={post.localFileUri}
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
  post, author, originalAuthor, onOptions, isRepost, mode, size = 35, withReactions = true, badge,
}) => {
  const { navigate } = useNavigation()
  const { profile } = useUser()
  const { trackSelectPost } = useAnalytics()

  const navigateToComments = useCallback(() => {
    navigate(routes.COMMENTS, { post })
    trackSelectPost(post.id)
  }, [navigate, post, trackSelectPost])

  if (!author) return <PostPlaceholder withReactions={withReactions} avatarSize={size} />

  return (
    <View style={[styles.wrapper, isRepost && styles.noMargin]}>
      <Header
        badge={badge}
        isRepost={isRepost}
        post={post}
        author={author}
        size={size}
        onOptions={onOptions}
      />
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

export const propsAreEqual = (prevProps, nextProps) => (
  prevProps.post.updatedAt === nextProps.post.updatedAt
  && prevProps.withReactions && nextProps.withReactions
  && prevProps.author && nextProps.author
  && prevProps.author.id === nextProps.author.id
  && prevProps.post.comments.length === nextProps.post.comments.length
  && prevProps.post.localFileUri === nextProps.post.localFileUri
)
export default React.memo(BasicPost, propsAreEqual)
