/* eslint-disable radix */
import { memo, useCallback, useState, useEffect } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import useReactions from '@app/features/post/hooks/reactions'
import Reaction from '@app/features/post/components/reaction'
import { api } from '@app/shared/services'
import { strings } from '@app/config'

import styles from './styles'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
  LOVE: 'love',
  SHARE: 'share',
}

const Reactions = ({
  post: givenPost, author, comments, onComment,
}) => {
  const [post, setPost] = useState(givenPost)

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

  return (
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
        onPress={() => onReaction(REACTION_TYPES.COMMENT)}
        testID="comment-button"
      />
      <Reaction
        iconName="share"
        count={count.shares}
        onPress={() => onReaction(REACTION_TYPES.SHARE)}
        testID="share-button"
      />
    </View>
  )
}

export default memo(Reactions)
