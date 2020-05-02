import React, { memo } from 'react'
import { View } from 'react-native'
import moment from 'moment'

import { ThemedText } from 'Kebetoo/src/shared/components/text'
import Avatar from 'Kebetoo/src/shared/components/avatar'
import PostPlaceholder from 'Kebetoo/src/shared/components/placeholders/posts'
import Reactions from 'Kebetoo/src/packages/post/containers/reactions'

import styles from './styles'

const isUpdated = (post) => post.createdAt !== post.updatedAt

const Edited = ({ size }) => (
  <>
    <ThemedText size={size} text=" • " />
    <ThemedText size={size} text="Edited" />
  </>
)

export const Header = ({
  post, author, size, Left,
}) => (
  <View style={styles.header}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Left && <Left />}
      <Avatar src={author.photoURL} text={author.displayName} size={size} />
    </View>
    <View style={[styles.meta, { height: size }]}>
      <ThemedText size="sm" text={author.displayName} />
      <View style={styles.smallMeta}>
        <ThemedText size="xs" text={moment(post.createdAt).fromNow()} />
        {isUpdated(post) && <Edited size="xs" />}
      </View>
    </View>
  </View>
)

export const Content = ({ post, style }) => (
  <View style={[styles.content, style]}>
    <ThemedText text={post.content} />
  </View>
)


const BasicPost = ({ post, author, size = 35 }) => (
  !author ? <PostPlaceholder /> : (
    <View style={styles.wrapper}>
      <Header post={post} author={author} size={size} />
      <Content post={post} />
      <Reactions post={post} author={author.id} />
    </View>
  )
)

export default memo(BasicPost)
