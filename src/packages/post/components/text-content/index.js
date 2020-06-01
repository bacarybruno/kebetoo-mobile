import React from 'react'

import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import { ThemedText } from 'Kebetoo/src/shared/components/text'

import styles from './styles'

const TextContent = ({ post, style, onPress }) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={[styles.wrapper, style]}
  >
    <ThemedText text={post.content} />
  </Pressable>
)

export default TextContent
