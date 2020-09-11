/* eslint-disable radix */
import React, { useCallback, useState, useEffect } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import useReactions from '@app/features/post/hooks/reactions'
import Reaction from '@app/features/post/components/reaction'
import * as api from '@app/shared/helpers/http'
import strings from '@app/config/strings'

import styles from './styles'

export const REACTION_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
  COMMENT: 'comment',
  LOVE: 'love',
  SHARE: 'share',
}

export const bottomSheetItems = [{
  title: strings.reactions.share_now,
  icon: 'ios-share-alt',
}, {
  title: strings.reactions.write_post,
  icon: 'ios-share',
}, {
  title: strings.general.cancel,
  icon: 'md-close',
}]

const Reactions = ({
  post: givenPost, author, comments, onComment,
}) => {
  const [post, setPost] = useState(givenPost)
  const [dirty, setDirty] = useState(false)

  const {
    count, isDirty, onReaction, userReactionType,
  // eslint-disable-next-line object-curly-newline
  } = useReactions({ post, author, comments, onComment })

  const { addListener: addNavigationListener } = useNavigation()

  const updatePost = useCallback(async () => {
    const updatedPost = await api.getPost(post.id)
    setPost(updatedPost)
    setDirty(false)
  }, [post.id])

  useEffect(() => { setDirty(isDirty) }, [isDirty])

  useEffect(() => {
    const unsusbcribeFocus = addNavigationListener('focus', () => {
      if (dirty) updatePost()
    })
    return unsusbcribeFocus
  }, [addNavigationListener, dirty, updatePost])

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

export default React.memo(Reactions)
