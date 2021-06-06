import { memo, useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { Platform, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Portal } from '@gorhom/portal'

import useReactions from '@app/features/post/hooks/reactions'
import Reaction from '@app/features/post/components/reaction'
import { api } from '@app/shared/services'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import useComments from '@app/features/comments/containers/hook'
import { CommentsCount } from '@app/features/stories/components/slide'
import CommentsView from '@app/features/comments/components/comments-view'

import styles from './styles'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
  LOVE: 'love',
  SHARE: 'share',
}

export const CommentsBottomSheet = ({
  post, count, bottomSheet, onBottomSheetIndexChange,
}) => {
  const commentInput = useRef()
  const scrollView = useRef()
  const navigation = useNavigation()

  const commentHelpers = useComments(
    post,
    commentInput,
    scrollView,
    navigation,
  )

  const snapPoints = useMemo(() => ['0%', '50%', '70%'], [])

  const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} />, [])

  return (
    <Portal hostName="bottom-sheet">
      <BottomSheet
        index={2}
        ref={bottomSheet}
        handleComponent={null}
        snapPoints={snapPoints}
        backgroundComponent={null}
        backdropComponent={renderBackdrop}
        onChange={onBottomSheetIndexChange}
        animateOnMount={Platform.OS === 'android'}
      >
        <CommentsCount
          onDismiss={() => bottomSheet.current.close()}
          count={count}
        />
        <CommentsView
          {...commentHelpers}
          navigation={navigation}
          scrollView={scrollView}
          commentInput={commentInput}
        />
      </BottomSheet>
    </Portal>
  )
}

const Reactions = ({
  post: givenPost, author, comments, onComment,
}) => {
  const [post, setPost] = useState(givenPost)
  const bottomSheet = useRef()
  const [commentsOpened, setCommentsOpened] = useState(false)

  const { count, onReaction, userReactionType } = useReactions({
    post, author, comments, onComment,
  })

  const { addListener: addNavigationListener } = useNavigation()

  const updatePost = useCallback(async () => {
    const updatedPost = await api.posts.getById(post.id)
    setPost(updatedPost)
  }, [post.id])

  useEffect(() => {
    const unsusbcribeFocus = addNavigationListener('focus', updatePost)
    return unsusbcribeFocus
  }, [addNavigationListener, updatePost])

  const onCommentReaction = useCallback(() => {
    if (onComment) {
      return onComment()
    }
    return setCommentsOpened(true)
  }, [onComment])

  const onBottomSheetIndexChange = useCallback((index) => setCommentsOpened(index > 0), [])

  return (
    <>
      <View style={styles.reactions}>
        <Reaction
          iconName={userReactionType === REACTION_TYPES.LIKE ? 'like-fill' : 'like'}
          color={userReactionType === REACTION_TYPES.LIKE ? 'like' : undefined}
          count={count.likes}
          onPress={() => onReaction(REACTION_TYPES.LIKE)}
          testID="like-button"
        />
        <Reaction
          iconName={userReactionType === REACTION_TYPES.DISLIKE ? 'dislike-fill' : 'dislike'}
          color={userReactionType === REACTION_TYPES.DISLIKE ? 'dislike' : undefined}
          count={count.dislikes}
          onPress={() => onReaction(REACTION_TYPES.DISLIKE)}
          testID="dislike-button"
        />
        <Reaction
          iconName="comment"
          count={count.comments}
          onPress={onCommentReaction}
          testID="comment-button"
        />
        <Reaction
          iconName="share"
          count={count.shares}
          onPress={() => onReaction(REACTION_TYPES.SHARE)}
          testID="share-button"
        />
      </View>
      {commentsOpened && (
        <CommentsBottomSheet
          post={post}
          count={count.comments}
          bottomSheet={bottomSheet}
          onBottomSheetIndexChange={onBottomSheetIndexChange}
        />
      )}
    </>
  )
}

export default memo(Reactions)
