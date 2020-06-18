import React from 'react'

import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import { ThemedText } from 'Kebetoo/src/shared/components/text'

import styles from './styles'
import { POST_TYPES } from '../../containers/basic-post'

const TextContent = ({
  post, style, onPress, type,
}) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={[styles.wrapper, type === POST_TYPES.REPOST && styles.repost, style]}
  >
    <ThemedText text={post.content} />
  </Pressable>
)

export default React.memo(TextContent)
