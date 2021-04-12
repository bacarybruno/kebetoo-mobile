import { memo } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'

import BasicPost, { Content, POST_TYPES, getPostType } from '@app/features/post/containers/basic-post'
import { deleteProperty } from '@app/shared/helpers/object'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const RepostContent = ({
  post, originalAuthor, style, onPress, mode,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={[styles.wrapper, style]}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          <Content post={deleteProperty(post, 'repost')} type={POST_TYPES.REPOST} mode={mode} />
          <View style={[
            styles.content,
            getPostType(post.repost) === POST_TYPES.IMAGE && styles.imageContent,
          ]}
          >
            <BasicPost
              isRepost
              post={post.repost}
              withReactions={false}
              author={originalAuthor}
              mode={mode}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default memo(RepostContent)
