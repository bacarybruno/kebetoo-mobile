import React, { memo } from 'react'
import { View } from 'react-native'

import BaseReactions from 'Kebetoo/src/packages/post/containers/reactions'

import DraggableIndicator from '../draggable-indicator'

import styles from './styles'

const Reactions = ({ post, author, ...reactionProps }) => (
  <View style={styles.reactionsContainer}>
    <DraggableIndicator />
    <View style={styles.reactions}>
      <BaseReactions post={post} author={author} {...reactionProps} />
    </View>
  </View>
)

export default memo(Reactions)
