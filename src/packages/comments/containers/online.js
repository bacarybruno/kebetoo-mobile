import React, {
  useState, useEffect, useCallback, useRef, memo, useMemo,
} from 'react'
import { View, FlatList } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import auth from '@react-native-firebase/auth'

import { Content, Header } from 'Kebetoo/src/packages/post/containers/basic-post'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import * as api from 'Kebetoo/src/shared/helpers/http'

import { NoComments } from './index'
import CommentInput from '../components/comment-input'
import Reactions from '../components/reactions'
import Comment from '../components/comment'
import styles from './styles'
import useAudioRecorder from '../../post/hooks/audio-recorder'

export const routeOptions = {}

// TODO: paginate comments
const Comments = () => {
  const user = auth().currentUser
  const audioRecorder = useAudioRecorder()
  const { params: { post } } = useRoute()
  const { goBack } = useNavigation()
  const [authors, setAuthors] = useState({})
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(post.comments)
  const commentInput = useRef()

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
    let result
    if (audioRecorder.hasRecording) {
      result = await audioRecorder.saveComment(post.id, user.uid)
    } else if (comment.length > 0) {
      result = await api.commentPost({
        author: user.uid,
        content: comment,
        post: post.id,
      })
      commentInput.current.clear()
    }
    setComments((value) => [...value, result])
  }, [audioRecorder, comment, post.id, user.uid])

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
        <Header Left={ListHeaderLeft} author={user} post={post} size={35} />
        <Content post={post} style={styles.content} />
      </View>
      <Reactions
        post={post}
        author={user.uid}
        onComment={onComment}
      />
    </View>
  ), [ListHeaderLeft, onComment, post, user])

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
        audioRecorder={audioRecorder}
        value={comment}
      />
    </View>
  )
}

export default memo(Comments)
