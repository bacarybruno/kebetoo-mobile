import React, {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth'
import Ionicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import {
  Content, Reactions as BaseReactions, Header,
} from 'Kebetoo/src/packages/post/containers/basic-post'
import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import Text from 'Kebetoo/src/shared/components/text'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import colors from 'Kebetoo/src/theme/colors'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import { commentPost } from 'Kebetoo/src/shared/helpers/http'

import styles from './styles'

export const routeOptions = {}

export const DraggableIndicator = () => (
  <View style={styles.draggableContainer}>
    <View style={styles.draggableIcon} />
  </View>
)

export const SendButton = ({ onPress }) => (
  <TouchableOpacity style={styles.send} onPress={onPress}>
    <Ionicon style={styles.sendIcon} name="md-send" size={25} color={colors.white} />
  </TouchableOpacity>
)

const CommentInput = ({ onChange, onSend, inputRef }) => (
  <View style={styles.commentInputWrapper}>
    <View style={styles.flexible}>
      <TextInput
        fieldName="comment"
        placeholder="Add a comment"
        onValueChange={onChange}
        ref={inputRef}
        textStyle={styles.textInputSize}
        wrapperStyle={[
          styles.textInputSize,
          styles.textInputWrapper,
        ]}
      />
    </View>
    <SendButton onPress={onSend} />
  </View>
)

const Reactions = ({ post, author }) => (
  <View style={styles.reactionsContainer}>
    <DraggableIndicator />
    <View style={styles.reactions}>
      <BaseReactions post={post} author={author} />
    </View>
  </View>
)

// TODO: paginate comments
const Comments = () => {
  const { params } = useRoute()
  const { goBack } = useNavigation()
  const posts = useSelector((state) => state.postsReducer.posts)
  const post = posts.find((p) => p.id === params.id)
  const author = useSelector((state) => state.postsReducer.authors)[post.author]
  const user = auth().currentUser
  const [authors, setAuthors] = useState({})
  const [comment, setComment] = useState('')
  const commentInput = useRef()

  useEffect(() => {
    const fetchAuthors = async () => {
      if (post.comments.length > 0) {
        const ids = new Set(post.comments.map((c) => c.author))
        const { docs } = await getUsers([...ids])
        const authorsData = {}
        docs.forEach((doc) => {
          const { displayName: name, photoURL } = doc.data()
          authorsData[doc.id] = {
            displayName: name,
            photoURL,
          }
        })
        setAuthors(authorsData)
      }
    }

    fetchAuthors()
  }, [post])

  const onChangeText = useCallback((value) => {
    setComment(value)
  }, [setComment])

  const onSend = useCallback(async () => {
    await commentPost({
      author: user.uid,
      content: comment,
      post: post.id,
    })
    commentInput.current.clear()
  }, [comment, user, post])

  const renderComment = ({ item }) => (
    authors[item.author] ? (
      <View style={styles.comment}>
        <View style={{ flexDirection: 'row', ...styles.flexible }}>
          <View style={{ marginRight: 10 }}>
            <Avatar
              src={authors[item.author].photoURL}
              text={authors[item.author].displayName}
              size={35}
            />
          </View>
          <View style={styles.flexible}>
            <View style={styles.flexible}>
              <View style={{ flexDirection: 'row', ...styles.flexible }}>
                <Text size="sm" text={authors[item.author].displayName} />
                <Text text=" • " />
                <Text size="sm" text={moment(item.updatedAt).fromNow()} />
              </View>
            </View>
            <Text text={item.content} />
          </View>
        </View>
        <Ionicon name="ios-heart-empty" size={15} />
      </View>
    ) : null
  )

  const ListHeaderLeft = () => (
    <HeaderBackButton
      onPress={goBack}
      backImage={() => (
        <View style={styles.backHandler}>
          <Kebeticon name="chevron-left" size={20} />
        </View>
      )}
    />
  )

  const ListHeader = () => (
    <View style={styles.post}>
      <Header Left={ListHeaderLeft} author={author} post={post} size={35} />
      <Content post={post} style={styles.content} />
      <Reactions post={post} author={author} />
    </View>
  )

  const keyExtractor = (item, index) => `comment-${item.id}-${index}`

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={post.comments}
        renderItem={renderComment}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatlistContent}
      />
      <CommentInput
        onChange={onChangeText}
        onSend={onSend}
        inputRef={commentInput}
      />
    </View>
  )
}

export default Comments
