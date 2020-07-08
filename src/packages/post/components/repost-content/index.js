import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'

import BasicPost, { Content, POST_TYPES, getPostType } from 'Kebetoo/src/packages/post/containers/basic-post'
import { deleteProperty } from 'Kebetoo/src/shared/helpers/object'

import styles from './styles'

const RepostContent = ({
  post, originalAuthor, style, onPress, mode,
}) => (
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

export default React.memo(RepostContent)
