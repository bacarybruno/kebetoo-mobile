import React from 'react'

import Pressable from '@app/shared/components/buttons/pressable'
import Typography, { types } from '@app/shared/components/typography'
import { POST_TYPES } from '@app/features/post/containers/basic-post'

import styles from './styles'

const TextContent = ({
  content, style, onPress, type, mode, isRepost,
}) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={[
      styles.wrapper,
      type === POST_TYPES.REPOST && styles.repost,
      style,
      mode === 'comments' && styles.comments,
      mode === 'comments' && isRepost && styles.commentRepost,
    ]}
  >
    <Typography type={types.body} text={content} />
  </Pressable>
)

export default React.memo(TextContent)
