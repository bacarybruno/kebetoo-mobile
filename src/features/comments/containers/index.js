import React, { useCallback, useRef, useMemo } from 'react'
import {
  View, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Content, Header } from '@app/features/post/containers/basic-post'
import { HeaderBack, NoContent } from '@app/shared/components'
import { strings } from '@app/config'
import {
  useAppColors, useAppStyles, useAudioRecorder, useUser,
} from '@app/shared/hooks'
import { metrics } from '@app/theme'

import createThemedStyles from './styles'
import CommentInput from '../components/comment-input'
import Reactions from '../components/reactions'
import Comment from '../components/comment'
import Swipeable from '../components/swipeable'
import useComments from './hook'

export const NoComments = () => (
  <NoContent title={strings.general.no_content} text={strings.comments.no_content} />
)

export const CommentReply = ({ reply, profile }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.replyWrapper}>
      <Comment
        item={reply}
        user={profile.uid}
        authorId={reply.author.id}
        displayName={reply.author.displayName}
        photoURL={reply.author.photoURL}
        avatarSize={30}
      />
    </View>
  )
}

// TODO: paginate comments
// TODO: create custom hook
const Comments = () => {
  const audioRecorder = useAudioRecorder()
  const { params: { post } } = useRoute()
  const navigation = useNavigation()

  const commentInput = useRef()
  const scrollView = useRef()

  const { profile } = useUser()
  const {
    clearToReply,
    loadReplies,
    onComment,
    onCommentContentPress: onCommentPress,
    onSend,
    onSetReply,
    setComment,
    authors,
    comments,
    isLoading,
    toReply,
    replies,
    comment,
  } = useComments(navigation, post, commentInput)
  const insets = useSafeAreaInsets()

  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()

  const renderComment = useMemo(() => ({ item }) => {
    if (!item.author) return null

    const checkSelectedComment = (c) => (
      toReply?.id === c.id ? styles.selectedComment : {}
    )

    const onShowReplies = () => loadReplies(item)

    return (
      <View style={styles.comment}>
        <Swipeable
          style={[styles.swipeable, checkSelectedComment(item)]}
          onFulfilled={() => onSetReply(item)}
        >
          <Comment
            item={item}
            user={profile.uid}
            authorId={item.author.id}
            displayName={item.author.displayName}
            photoURL={item.author.photoURL}
            repliesCount={item.replies?.length}
            onShowReplies={onShowReplies}
          />
        </Swipeable>
        {replies[item.id]?.map((reply) => (
          <Swipeable
            onFulfilled={() => onSetReply(reply)}
            style={[styles.swipeableReply, checkSelectedComment(reply)]}
            key={`comment-reply-${reply.id}`}
          >
            <CommentReply reply={reply} profile={profile} />
          </Swipeable>
        ))}
      </View>
    )
  }, [styles, profile, replies, toReply, loadReplies, onSetReply])

  const ListHeaderLeft = useCallback(() => (
    <HeaderBackButton
      onPress={navigation.goBack}
      labelVisible={false}
      backImage={() => (
        <HeaderBack tintColor={colors.textPrimary} />
      )}
    />
  ), [colors.textPrimary, navigation.goBack])

  const ListHeader = useMemo(() => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Header Left={ListHeaderLeft} author={post.author} post={post} size={35} />
        <Content
          post={post}
          style={styles.content}
          mode="comments"
          onPress={onCommentPress}
          originalAuthor={
            post.repost
              ? authors[post.repost.author]
              : post.author
          }
        />
      </View>
      <Reactions post={post} author={profile.uid} comments={comments} onComment={onComment} />
    </View>
  ), [ListHeaderLeft, styles, authors, comments, onComment, onCommentPress, post, profile.uid])

  const keyExtractor = useCallback((item, index) => `comment-${item.id}-${index}`, [])

  return (
    <View style={styles.wrapper}>
      <View style={styles.flexible}>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={NoComments}
          contentContainerStyle={styles.flatlistContent}
          removeClippedSubviews
          ref={scrollView}
        />
      </View>
      <KeyboardAvoidingView
        style={styles.keyboard}
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={insets.bottom + metrics.marginVertical + getBottomSpace()}
        behavior="padding"
      >
        <CommentInput
          onChange={setComment}
          onSend={onSend}
          inputRef={commentInput}
          audioRecorder={audioRecorder}
          value={comment}
          isLoading={isLoading}
          reply={toReply}
          onReplyClose={clearToReply}
        />
      </KeyboardAvoidingView>
    </View>
  )
}

export default React.memo(Comments)
