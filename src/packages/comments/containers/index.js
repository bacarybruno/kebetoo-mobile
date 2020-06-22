import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react'
import { View, FlatList } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import auth from '@react-native-firebase/auth'

import {
  Content, Header, getPostType, POST_TYPES,
} from 'Kebetoo/src/packages/post/containers/basic-post'
import useAudioRecorder from 'Kebetoo/src/shared/hooks/audio-recorder'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import NoContent from 'Kebetoo/src/shared/components/no-content'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import * as api from 'Kebetoo/src/shared/helpers/http'
import routes from 'Kebetoo/src/navigation/routes'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'
import CommentInput from '../components/comment-input'
import Reactions from '../components/reactions'
import Comment from '../components/comment'

export const NoComments = () => (
  <NoContent title={strings.general.no_content} text={strings.comments.no_content} />
)

// TODO: paginate comments
const Comments = () => {
  const user = auth().currentUser
  const audioRecorder = useAudioRecorder()
  const { params: { post } } = useRoute()
  const { goBack, navigate } = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [authors, setAuthors] = useState({})
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(post.comments.map((commentId) => ({
    id: commentId,
    author: '',
    reactions: [],
  })))
  const commentInput = useRef()
  const scrollView = useRef()

  useEffect(() => {
    const fetchComments = async () => {
      const result = await api.getComments(post.id)
      setComments(result)
    }
    fetchComments()
  }, [post.id])

  useEffect(() => {
    const fetchAuthors = async () => {
      let authorsToFetch = [post.author]
      if (comments.length > 0) {
        authorsToFetch = authorsToFetch.concat(
          comments
            .filter((c) => c.author)
            .map((c) => c.author),
        )
      }
      if (post.repost) {
        authorsToFetch = authorsToFetch.concat(post.repost.author)
      }
      const ids = [...new Set(authorsToFetch)]
      const newAuthors = ids.filter((id) => !authors[id])

      if (newAuthors.length === 0) return

      const { docs } = await getUsers(newAuthors)
      docs.forEach((doc) => {
        const { displayName: name, photoURL } = doc.data()
        authors[doc.id] = {
          displayName: name,
          photoURL,
        }
      })
      setAuthors({ ...authors })
    }
    fetchAuthors()
  }, [comments, authors, post])

  const onChangeText = useCallback((value) => {
    setComment(value)
  }, [])

  const getAuthor = useCallback((authorId) => {
    if (authors[authorId]) return authors[authorId]
    return { displayName: null, photoURL: null }
  }, [authors])

  const onSend = useCallback(async () => {
    let result = null
    setIsLoading(true)
    if (audioRecorder.hasRecording) {
      result = await audioRecorder.saveComment(post.id, user.uid)
    } else if (comment.length > 0) {
      result = await api.commentPost({
        author: user.uid,
        content: comment,
        post: post.id,
      })
      commentInput.current.clear()
      setComment('')
    }
    setComments((value) => [...value, result])
    setIsLoading(false)
    setTimeout(() => scrollView.current.scrollToEnd(), 200)
  }, [audioRecorder, comment, post.id, user.uid])

  const renderComment = useMemo(() => ({ item }) => {
    const commentAuthor = getAuthor(item.author)
    return (
      <View style={styles.comment}>
        <Comment
          item={item}
          user={user.uid}
          displayName={commentAuthor.displayName}
          photoURL={commentAuthor.photoURL}
        />
      </View>
    )
  }, [getAuthor, user.uid])

  const ListHeaderLeft = useCallback(() => (
    <HeaderBackButton
      onPress={goBack}
      backImage={({ tintColor }) => (
        <HeaderBack tintColor={tintColor} />
      )}
    />
  ), [goBack])

  const onComment = useCallback(() => commentInput.current.focus(), [])

  const onCommentContentPress = useCallback(() => {
    const type = getPostType(post)
    if (type === POST_TYPES.IMAGE) {
      navigate(routes.MODAL_IMAGE, post.image)
      return false
    }
    return true
  }, [navigate, post])

  const ListHeader = useMemo(() => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Header Left={ListHeaderLeft} author={authors[post.author]} post={post} size={35} />
        <Content
          post={post}
          style={styles.content}
          mode="comments"
          onPress={onCommentContentPress}
          originalAuthor={
            post.repost
              ? authors[post.repost.author]
              : authors[post.author]
          }
        />
      </View>
      <Reactions
        post={post}
        author={user.uid}
        comments={comments}
        onComment={onComment}
      />
    </View>
  ), [ListHeaderLeft, authors, comments, onComment, onCommentContentPress, post, user.uid])

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
