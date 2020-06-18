import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'

import BasicPost, { Content } from 'Kebetoo/src/packages/post/containers/basic-post'
import { deleteProperty } from 'Kebetoo/src/shared/helpers/object'

import styles from './styles'

const RepostContent = ({
  post, originalAuthor, style, onPress,
}) => (
  <View style={[styles.wrapper, style]}>
    <TouchableWithoutFeedback onPress={onPress}>
      <View>
        <Content post={deleteProperty(post, 'repost')} />
        <View style={styles.content}>
          <BasicPost isRepost post={post.repost} withReactions={false} author={originalAuthor} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
)

export default React.memo(RepostContent)
