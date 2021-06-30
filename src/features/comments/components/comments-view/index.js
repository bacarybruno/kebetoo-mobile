import {
  memo, useCallback, useMemo, useContext, useEffect,
} from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { NoContent } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppColors, useAppStyles, useUser } from '@app/shared/hooks'
import { metrics } from '@app/theme'
import { SafeAreaContext } from '@app/shared/contexts'
import CommentInput from '@app/features/comments/components/comment-input'
import Comment from '@app/features/comments/components/comment'
import SwipeableComment from '@app/features/comments/components/swipeable'

import createThemedStyles from './styles'

export const NoComments = () => (
  <NoContent title={strings.general.no_content} text={strings.comments.no_content} />
)

export const CommentReply = ({ reply, profile, navigation }) => {
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
        navigation={navigation}
      />
    </View>
  )
}

const CommentItem = ({
  item, replies, toReply, onSetReply, loadReplies, navigation,
}) => {
  const styles = useAppStyles(createThemedStyles)

  const { profile } = useUser()

  const checkSelectedComment = (comment) => (
    toReply?.id === comment.id ? styles.selectedComment : {}
  )

  const onShowReplies = () => loadReplies(item)

  if (!item.author) return null

  return (
    <View style={styles.comment}>
      <SwipeableComment
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
          navigation={navigation}
        />
      </SwipeableComment>
      {replies[item.id]?.map((reply) => (
        <SwipeableComment
          onFulfilled={() => onSetReply(reply)}
          style={[styles.swipeableReply, checkSelectedComment(reply)]}
          key={`comment-reply-${reply.id}`}
        >
          <CommentReply reply={reply} profile={profile} navigation={navigation} />
        </SwipeableComment>
      ))}
    </View>
  )
}

// TODO: paginate comments
const CommentsView = ({
  navigation,
  scrollView,
  renderHeader,
  commentInput,
  audioRecorder,

  // hook items
  clearToReply,
  loadReplies,
  onSend,
  onSetReply,
  setComment,
  comments,
  isLoading,
  toReply,
  replies,
  comment,
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const { updateTopSafeAreaColor, resetStatusBars } = useContext(SafeAreaContext)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    updateTopSafeAreaColor(colors.backgroundSecondary)
    return resetStatusBars
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderComment = useMemo(() => ({ item }) => (
    <CommentItem
      item={item}
      replies={replies}
      toReply={toReply}
      onSetReply={onSetReply}
      loadReplies={loadReplies}
      navigation={navigation}
    />
  ), [replies, toReply, loadReplies, onSetReply, navigation])

  const keyExtractor = useCallback((item, index) => `comment-${item?.id}-${index}`, [])

  return (
    <View style={styles.wrapper}>
      <View style={styles.flexible}>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
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

export default memo(CommentsView)
