import React, { memo } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import ReactionsOffline from 'Kebetoo/src/packages/post/containers/reactions'
import ReactionsOnline from 'Kebetoo/src/packages/post/containers/reactions/online'
import { postsSelector } from 'Kebetoo/src/redux/selectors'

import DraggableIndicator from '../draggable-indicator'

import styles from './styles'

const Reactions = ({ post, author, ...reactionProps }) => {
  const posts = useSelector(postsSelector)
  const ReactionsComponent = posts[post.id] !== undefined
    ? ReactionsOffline
    : ReactionsOnline
  return (
    <View style={styles.reactionsContainer}>
      <DraggableIndicator />
      <View style={styles.reactions}>
        <ReactionsComponent post={post} author={author} {...reactionProps} />
      </View>
    </View>
  )
}

export default memo(Reactions)
