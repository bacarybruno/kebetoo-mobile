import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react'
import { View, FlatList } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'

import {
  Content, Header, getPostType, POST_TYPES,
} from '@app/features/post/containers/basic-post'
import { useAudioRecorder, useUser, usePosts } from '@app/shared/hooks'
import { HeaderBack, NoContent } from '@app/shared/components'
import * as api from '@app/shared/services/http'
import routes from '@app/navigation/routes'
import { strings } from '@app/config'
import { colors } from '@app/theme'
import { getSource } from '@app/features/post/components/image-content'

import styles from './styles'
import CommentInput from '../components/comment-input'
import Reactions from '../components/reactions'
import Comment from '../components/comment'
import Swipeable from '../components/swipeable'

export const NoComments = () => (
  <NoContent title={strings.general.no_content} text={strings.comments.no_content} />
)

export const CommentReply = ({ reply, profile }) => (
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

const mapComments = (comment) => ({
  id: comment.id,
  author: {
    id: comment.author,
    displayName: ' ',
    photoURL: null,
  },
  reactions: [],
})

// TODO: paginate comments
// TODO: use local reducer
const Comments = () => {
  const audioRecorder = useAudioRecorder()
  const { params: { post } } = useRoute()
  const { goBack, navigate } = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [authors, setAuthors] = useState({})
  const [comment, setComment] = useState('')
  const [toReply, setToReply] = useState(null)
  const [comments, setComments] = useState(post.comments?.map(mapComments) || [])
  const [replies, setReplies] = useState({})

  const { profile } = useUser()
  const commentInput = useRef()
  const scrollView = useRef()

  const { getRepostAuthors } = usePosts()

  useEffect(() => {
    const fetchComments = async () => {
      const result = await api.getComments(post.id)
      setComments(result)
    }
    fetchComments()
  }, [post.id])

  useEffect(() => {
    const fetchRepostAuthors = async () => {
      const data = await getRepostAuthors(post)
      setAuthors(data)
    }
    fetchRepostAuthors()
  }, [post, getRepostAuthors])

  const onSend = useCallback(async () => {
    let result = null
    setIsLoading(true)

    let replyThread = null
    if (toReply) {
      // use the comment reply thread or the base comment
      replyThread = toReply.thread || toReply
    }

    if (audioRecorder.hasRecording) {
      result = await audioRecorder.saveComment(post.id, profile.uid, replyThread)
    } else if (comment.length > 0) {
      result = await api.commentPost({
        author: profile.uid,
        content: comment,
        thread: replyThread ? replyThread.id : null,
        post: replyThread ? null : post.id,
      })
      commentInput.current?.clear()
      setComment('')
    }
    if (replyThread) {
      setReplies((state) => ({
        ...state,
        [replyThread.id]: (state[replyThread.id] || []).concat(result),
      }))
      setToReply(null)
    } else {
      setComments((value) => [...value, result])
      setTimeout(() => scrollView.current?.scrollToEnd(), 200)
    }
    setIsLoading(false)
  }, [audioRecorder, comment, post.id, profile.uid, toReply])

  const onSetReply = useCallback((item) => {
    commentInput.current?.focus()
    setToReply(item)
  }, [])

  const loadReplies = useCallback(async (c) => {
    if (!replies[c.id]) {
      setReplies((state) => ({ ...state, [c.id]: c.replies.map(mapComments) }))
    }
    const loadedReplies = await api.getReplies(c.id)
    setReplies((state) => ({ ...state, [c.id]: loadedReplies }))
  }, [replies])

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
          >
            <CommentReply reply={reply} profile={profile} key={`comment-reply-${reply.id}`} />
          </Swipeable>
        ))}
      </View>
    )
  }, [toReply, profile, replies, onSetReply, loadReplies])

  const ListHeaderLeft = useCallback(() => (
    <HeaderBackButton
      onPress={goBack}
      backImage={() => (
        <HeaderBack tintColor={colors.textPrimary} />
      )}
    />
  ), [goBack])

  const onComment = useCallback(() => commentInput.current?.focus(), [])

  const onCommentContentPress = useCallback(() => {
    const type = getPostType(post)
    if (type === POST_TYPES.IMAGE) {
      navigate(routes.MODAL_IMAGE, {
        ...post.image,
        source: getSource(post.image.url),
      })
      return false
    }
    return true
  }, [navigate, post])

  const ListHeader = useMemo(() => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Header Left={ListHeaderLeft} author={post.author} post={post} size={35} />
        <Content
          post={post}
          style={styles.content}
          mode="comments"
          onPress={onCommentContentPress}
          originalAuthor={
            post.repost
              ? authors[post.repost.author]
              : post.author
          }
        />
      </View>
      <Reactions post={post} author={profile.uid} comments={comments} onComment={onComment} />
    </View>
  ), [ListHeaderLeft, authors, comments, onComment, onCommentContentPress, post, profile.uid])

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
      <CommentInput
        onChange={setComment}
        onSend={onSend}
        inputRef={commentInput}
        audioRecorder={audioRecorder}
        value={comment}
        isLoading={isLoading}
        reply={toReply}
        onReplyClose={() => setToReply(null)}
      />
    </View>
  )
}

export default React.memo(Comments)
