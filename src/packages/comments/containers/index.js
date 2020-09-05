import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react'
import { View, FlatList } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'

import {
  Content, Header, getPostType, POST_TYPES,
} from 'Kebetoo/src/packages/post/containers/basic-post'
import useAudioRecorder from 'Kebetoo/src/shared/hooks/audio-recorder'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import NoContent from 'Kebetoo/src/shared/components/no-content'
import * as api from 'Kebetoo/src/shared/helpers/http'
import routes from 'Kebetoo/src/navigation/routes'
import strings from 'Kebetoo/src/config/strings'
import colors from 'Kebetoo/src/theme/colors'
import usePosts from 'Kebetoo/src/shared/hooks/posts'
import useUser from 'Kebetoo/src/shared/hooks/user'
import { getSource } from 'Kebetoo/src/packages/post/components/image-content'

import styles from './styles'
import CommentInput from '../components/comment-input'
import Reactions from '../components/reactions'
import Comment from '../components/comment'

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
const Comments = () => {
  const audioRecorder = useAudioRecorder()
  const { params: { post } } = useRoute()
  const { goBack, navigate } = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [authors, setAuthors] = useState({})
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(
    post.comments ? post.comments.map(mapComments) : [],
  )

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
      result = await audioRecorder.saveComment(post.id, profile.uid)
    } else if (comment.length > 0) {
      result = await api.commentPost({
        author: profile.uid,
        content: comment,
        post: post.id,
      })
      commentInput.current?.clear()
      setComment('')
    }
    setComments((value) => [...value, result])
    setIsLoading(false)
    setTimeout(() => scrollView.current?.scrollToEnd(), 200)
  }, [audioRecorder, comment, post.id, profile.uid])

  const renderComment = useMemo(() => ({ item }) => {
    if (!item.author) return null
    return (
      <View style={styles.comment}>
        <Comment
          item={item}
          user={profile.uid}
          displayName={item.author.displayName}
          photoURL={item.author.photoURL}
        />
      </View>
    )
  }, [profile.uid])

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
        source: getSource(post.url),
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
      />
    </View>
  )
}

export default React.memo(Comments)
