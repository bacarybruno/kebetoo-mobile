import React from 'react'

import { Pressable, Typography } from '@app/shared/components'
import { POST_TYPES } from '@app/features/post/containers/basic-post'
import { useAppStyles } from '@app/shared/hooks'
import { ReadMore } from '@app/shared/components'

import createThemedStyles from './styles'

const TextContent = ({
  content, style, onPress, type, mode, isRepost,
}) => {
  const styles = useAppStyles(createThemedStyles)

  return (
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
      <ReadMore text={content.trim()} type={Typography.types.body} />
    </Pressable>
  )
}

export default React.memo(TextContent)
