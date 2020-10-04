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
import SwipeableComment from '../components/swipeable'

export const NoComments = () => (
  <NoContent title={strings.general.no_content} text={strings.comments.no_content} />
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

  const onChangeText = useCallback((value) => {
    setComment(value)
  }, [])

  const onSend = useCallback(async () => {
    let result = null
    setIsLoading(true)
    if (audioRecorder.hasRecording) {
      result = await audioRecorder.saveComment(post.id, profile.uid, toReply)
    } else if (comment.length > 0) {
      result = await api.commentPost({
        author: profile.uid,
        content: comment,
        thread: toReply ? toReply.id : null,
        post: toReply ? null : post.id,
      })
      commentInput.current?.clear()
      setComment('')
    }
    if (toReply) {
      setReplies((state) => ({ ...state, [toReply.id]: [...state[toReply.id], result] }))
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

  const loadReplies = useCallback(async (commentId) => {
    const loadedReplies = await api.getReplies(commentId)
    setReplies((state) => ({ ...state, [commentId]: loadedReplies }))
  }, [])

  const renderComment = useMemo(() => ({ item }) => {
    if (!item.author) return null
    const hasReplies = item.replies?.length > 0

    return (
      <View style={styles.comment}>
        <SwipeableComment style={styles.swipeable} onFulfilled={() => onSetReply(item)}>
          <Comment
            item={item}
            user={profile.uid}
            authorId={item.author.id}
            displayName={item.author.displayName}
            photoURL={item.author.photoURL}
            repliesCount={item.replies?.length}
            onShowReplies={() => loadReplies(item.id)}
          />
        </SwipeableComment>
        {hasReplies && replies[item.id]?.map((reply) => (
          <View style={styles.repliesWrapper} key={`comment-reply-${reply.id}`}>
            <Comment
              item={reply}
              user={profile.uid}
              authorId={reply.author.id}
              displayName={reply.author.displayName}
              photoURL={reply.author.photoURL}
            />
          </View>
        ))}
      </View>
    )
  }, [onSetReply, profile.uid, replies, loadReplies])

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
          ref={scrollView}
        />
      </View>
      <CommentInput
        onChange={onChangeText}
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
