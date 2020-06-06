import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react'
import { View, FlatList } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { useSelector, useDispatch } from 'react-redux'
import auth from '@react-native-firebase/auth'

import {
  Content, Header, getPostType, POST_TYPES,
} from 'Kebetoo/src/packages/post/containers/basic-post'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import NoContent from 'Kebetoo/src/shared/components/no-content'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import { postsSelector, authorsSelector } from 'Kebetoo/src/redux/selectors'
import * as types from 'Kebetoo/src/redux/types'
import strings from 'Kebetoo/src/config/strings'
import routes from 'Kebetoo/src/navigation/routes'
import * as api from 'Kebetoo/src/shared/helpers/http'

import styles from './styles'
import CommentInput from '../components/comment-input'
import Reactions from '../components/reactions'
import Comment from '../components/comment'
import useAudioRecorder from '../../post/hooks/audio-recorder'

export const NoComments = () => (
  <NoContent title={strings.general.no_content} text={strings.comments.no_content} />
)

// TODO: paginate comments
const Comments = () => {
  const user = auth().currentUser
  const audioRecorder = useAudioRecorder()
  const { params } = useRoute()
  const { goBack, navigate } = useNavigation()
  const [comments, setComments] = useState([])
  const [authors, setAuthors] = useState({})
  const [comment, setComment] = useState('')
  const commentInput = useRef()
  const normalizedPost = useSelector(postsSelector)[params.id]
  const [post, setPost] = useState((value) => value || normalizedPost)
  const dispatch = useDispatch()
  const author = useSelector(authorsSelector)[post.author]

  useEffect(() => {
    const fetchComments = async () => {
      const result = await api.getComments(params.id)
      setComments(result)
    }
    fetchComments()
  }, [params.id])

  useEffect(() => {
    if (normalizedPost.comments.length !== comments.length) {
      setPost(normalizedPost)
    }
  }, [comments, normalizedPost])

  useEffect(() => {
    const fetchAuthors = async () => {
      let authorsToFetch = []
      if (comments.length > 0) {
        authorsToFetch = authorsToFetch.concat(comments.map((c) => c.author))
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

  const onSend = useCallback(async () => {
    if (audioRecorder.hasRecording) {
      const result = await audioRecorder.saveComment(post.id, user.uid)
      dispatch({
        type: types.COMMENT_POST_SUCCESS,
        payload: result,
      })
      setComments((values) => [...values, result])
    } else if (comment.length > 0) {
      const result = await api.commentPost({ author: user.uid, post: post.id, content: comment })
      dispatch({
        type: types.COMMENT_POST_SUCCESS,
        payload: result,
      })
      setComments((values) => [...values, result])
      commentInput.current.clear()
      setComment('')
    }
  }, [audioRecorder, comment, dispatch, post.id, user.uid])

  const onReaction = useCallback(async (type, com) => {
    const userReaction = com.reactions.find((r) => r.author === user.uid)
    if (userReaction === undefined) {
      const result = await api.createCommentReaction(type, com.id, user.uid)
      setComments((values) => {
        values.find((v) => v.id === com.id).reactions.push(result)
        return [...values]
      })
    } else if (userReaction.type === type) {
      await api.deleteReaction(userReaction.id)
      setComments((values) => {
        const currentComment = values.find((v) => v.id === com.id)
        currentComment.reactions = currentComment.reactions.filter((r) => r.id !== userReaction.id)
        values.map((v) => (v.id === com.id ? currentComment : v))
        return [...values]
      })
    } else {
      await api.editReaction(userReaction.id, type)
      setComments((values) => {
        const currentComment = values.find((v) => v.id === com.id)
        currentComment.reactions.find((r) => r.id === userReaction.id).type = type
        values.map((v) => (v.id === com.id ? currentComment : v))
        return [...values]
      })
    }
  }, [user.uid])

  const renderComment = useMemo(() => ({ item }) => (
    <View style={styles.comment}>
      <Comment
        item={item}
        author={author}
        user={user.uid}
        onReaction={(type) => onReaction(type, item)}
      />
    </View>
  ), [author, onReaction, user])

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

  const ListHeader = useCallback(() => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Header Left={ListHeaderLeft} author={author} post={post} size={35} />
        <Content
          post={post}
          style={styles.content}
          mode="comments"
          onPress={onCommentContentPress}
        />
      </View>
      <Reactions post={post} author={user.uid} onComment={onComment} />
    </View>
  ), [ListHeaderLeft, author, onComment, onCommentContentPress, post, user.uid])

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
        />
      </View>
      <CommentInput
        onSend={onSend}
        value={comment}
        onChange={onChangeText}
        inputRef={commentInput}
        audioRecorder={audioRecorder}
      />
    </View>
  )
}

export default React.memo(Comments)
