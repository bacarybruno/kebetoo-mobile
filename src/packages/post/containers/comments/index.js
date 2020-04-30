import React, {
  useState, useEffect, useCallback, useRef, memo, useMemo,
} from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth'
import Ionicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import { Content, Header } from 'Kebetoo/src/packages/post/containers/basic-post'
import BaseReactions from 'Kebetoo/src/packages/post/containers/reactions'
import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import Text from 'Kebetoo/src/shared/components/text'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import colors from 'Kebetoo/src/theme/colors'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import { commentPost } from 'Kebetoo/src/shared/helpers/http'
import CommentPlaceholder from 'Kebetoo/src/shared/components/placeholders/comments'

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

export const CommentInput = ({
  onChange, onSend, inputRef, ...inputProps
}) => (
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
        {...inputProps}
      />
    </View>
    <SendButton onPress={onSend} />
  </View>
)

export const Reactions = ({ post, author, ...reactionProps }) => (
  <View style={styles.reactionsContainer}>
    <DraggableIndicator />
    <View style={styles.reactions}>
      <BaseReactions post={post} author={author} {...reactionProps} />
    </View>
  </View>
)

export const NoContent = () => (
  <View style={styles.noContent}>
    <Text color="primary" size="header" text="No content yet" />
    <Text text="Be the first to add a comment! 👇" />
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

  const { comments } = post

  useEffect(() => {
    const fetchAuthors = async () => {
      if (comments.length > 0) {
        const ids = new Set(comments.map((c) => c.author))
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
  }, [comments])

  const onChangeText = useCallback((value) => {
    setComment(value)
  }, [])

  const onSend = useCallback(async () => {
    if (comment.length > 0) {
      await commentPost({
        author: user.uid,
        content: comment,
        post: post.id,
      })
      commentInput.current.clear()
    }
  }, [comment, user, post])

  const renderComment = useMemo(() => ({ item }) => (
    <View style={styles.comment}>
      {authors[item.author] ? <Comment item={item} /> : <CommentPlaceholder />}
    </View>
  ), [authors])

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

  const Comment = ({ item }) => (
    <>
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
              <Text numberOfLines={1}>
                {authors[item.author].displayName}
                <Text size="sm" text=" • " />
                <Text size="sm" text={`${moment(item.updatedAt).fromNow()}`} />
              </Text>
            </View>
          </View>
          <Text text={item.content} />
        </View>
      </View>
      <Ionicon name="ios-heart-empty" size={15} style={styles.loveIcon} />
    </>
  )

  const ListHeader = () => (
    <View style={styles.post}>
      <Header Left={ListHeaderLeft} author={author} post={post} size={35} />
      <Content post={post} style={styles.content} />
      <Reactions
        post={post}
        author={author}
        onComment={() => commentInput.current.focus()}
      />
    </View>
  )

  const keyExtractor = (item, index) => `comment-${item.id}-${index}`

  return (
    <View style={styles.wrapper}>
      <View style={styles.flexible}>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={NoContent}
          contentContainerStyle={styles.flatlistContent}
        />
      </View>
      <CommentInput
        onChange={onChangeText}
        onSend={onSend}
        inputRef={commentInput}
        autoFocus={post.comments.length === 0}
      />
    </View>
  )
}

export default memo(Comments)
