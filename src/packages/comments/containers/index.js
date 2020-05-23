import React, {
  useState, useEffect, useCallback, useRef, memo, useMemo,
} from 'react'
import { View, FlatList } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { useSelector, useDispatch } from 'react-redux'
import auth from '@react-native-firebase/auth'

import { Content, Header } from 'Kebetoo/src/packages/post/containers/basic-post'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import NoContent from 'Kebetoo/src/shared/components/no-content'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import { commentsSelector, postsSelector, authorsSelector } from 'Kebetoo/src/redux/selectors'
import * as types from 'Kebetoo/src/redux/types'

import styles from './styles'
import CommentInput from '../components/comment-input'
import Reactions from '../components/reactions'
import Comment from '../components/comment'

export const routeOptions = {}

export const NoComments = () => (
  <NoContent title="No content yet" text="Be the first to add a comment! 👇" />
)

// TODO: paginate comments
const Comments = () => {
  const user = auth().currentUser
  const { params } = useRoute()
  const { goBack } = useNavigation()
  const [comments, setComments] = useState([])
  const [authors, setAuthors] = useState({})
  const [comment, setComment] = useState('')
  const commentInput = useRef()
  const normalizedPost = useSelector(postsSelector)[params.id]
  const [post, setPost] = useState((value) => value || normalizedPost)
  const author = useSelector(authorsSelector)[post.author]
  const dispatch = useDispatch()

  const normalizedComments = useSelector(commentsSelector)

  useEffect(() => {
    const coms = Object
      .values(normalizedComments)
      .filter((com) => com.post === params.id)
    setComments(coms)
  }, [normalizedComments, params.id])

  useEffect(() => {
    if (normalizedPost.comments.length !== comments.length) {
      setPost(normalizedPost)
    }
  }, [comments, normalizedPost])

  useEffect(() => {
    const fetchAuthors = async () => {
      if (comments.length > 0) {
        const ids = [...new Set(comments.map((c) => c.author))]
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
    }
    fetchAuthors()
  }, [comments, authors])

  const onChangeText = useCallback((value) => {
    setComment(value)
  }, [])

  const onSend = useCallback(async () => {
    if (comment.length > 0) {
      dispatch({
        type: types.COMMENT_POST,
        payload: {
          author: user.uid,
          content: comment,
          post: params.id,
        },
      })
      commentInput.current.clear()
    }
  }, [comment, dispatch, params.id, user.uid])

  const renderComment = useMemo(() => ({ item }) => (
    <View style={styles.comment}>
      <Comment author={authors[item.author]} item={item} />
    </View>
  ), [authors])

  const ListHeaderLeft = useCallback(() => (
    <HeaderBackButton
      onPress={goBack}
      backImage={({ tintColor }) => (
        <HeaderBack tintColor={tintColor} />
      )}
    />
  ), [goBack])

  const onComment = useCallback(() => commentInput.current.focus(), [])

  const ListHeader = useCallback(() => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Header Left={ListHeaderLeft} author={author} post={post} size={35} />
        <Content post={post} style={styles.content} />
      </View>
      <Reactions post={post} author={user.uid} onComment={onComment} />
    </View>
  ), [ListHeaderLeft, author, onComment, post, user.uid])

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
        onChange={onChangeText}
        onSend={onSend}
        inputRef={commentInput}
      />
    </View>
  )
}

export default memo(Comments)
