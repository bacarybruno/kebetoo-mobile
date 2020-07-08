import React from 'react'
import { View } from 'react-native'
import { Placeholder, PlaceholderMedia, PlaceholderLine } from 'rn-placeholder'

import { styles, Animation } from './comments'

export const PlaceholderAvatar = ({ size }) => (
  <PlaceholderMedia size={size} isRound style={{ marginRight: 10, ...styles.background }} />
)

const createAvatar = (size) => (props) => (
  <PlaceholderAvatar {...props} size={size} />
)

export const PlaceholderHeader = ({ avatarSize }) => (
  <Placeholder Animation={Animation} Left={createAvatar(avatarSize)}>
    <View style={{ height: avatarSize, marginBottom: 8 }}>
      <PlaceholderLine style={styles.background} height={10} width={50} />
      <PlaceholderLine style={styles.background} height={10} width={30} />
    </View>
  </Placeholder>
)

const PlaceholderContent = () => (
  <Placeholder Animation={Animation}>
    <PlaceholderLine
      height={52}
      style={{ marginBottom: 8, borderRadius: 5, ...styles.background }}
    />
  </Placeholder>
)

const PlaceholderReaction = () => (
  <PlaceholderLine width={15} height={20} style={{ marginRight: 10, ...styles.background }} />
)

const PlaceholderReactions = () => (
  <Placeholder Animation={Animation} style={{ marginBottom: 30 }}>
    <View style={{ flexDirection: 'row' }}>
      <PlaceholderReaction />
      <PlaceholderReaction />
      <PlaceholderReaction />
      <PlaceholderReaction />
    </View>
  </Placeholder>
)

const PostPlaceholder = ({ withReactions, avatarSize }) => (
  <>
    <PlaceholderHeader avatarSize={avatarSize} />
    <PlaceholderContent />
    {withReactions && <PlaceholderReactions />}
  </>
)

export default React.memo(PostPlaceholder)
