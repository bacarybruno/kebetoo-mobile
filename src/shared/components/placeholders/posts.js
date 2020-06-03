import React from 'react'
import { View } from 'react-native'
import {
  Placeholder, PlaceholderMedia, PlaceholderLine, Fade,
} from 'rn-placeholder'

const PlaceholderAvatar = () => (
  <PlaceholderMedia isRound style={{ marginRight: 10 }} />
)

const PlaceholderHeader = () => (
  <Placeholder Animation={Fade} Left={PlaceholderAvatar} style={{ marginBottom: 8 }}>
    <PlaceholderLine height={10} width={50} />
    <PlaceholderLine height={10} width={30} />
  </Placeholder>
)

const PlaceholderContent = () => (
  <Placeholder Animation={Fade}>
    <PlaceholderLine height={52} style={{ marginBottom: 8, borderRadius: 5 }} />
  </Placeholder>
)

const PlaceholderReaction = () => (
  <PlaceholderLine width={15} height={20} style={{ marginRight: 10 }} />
)

const PlaceholderReactions = () => (
  <Placeholder style={{ marginBottom: 30 }}>
    <View style={{ flexDirection: 'row' }}>
      <PlaceholderReaction />
      <PlaceholderReaction />
      <PlaceholderReaction />
      <PlaceholderReaction />
    </View>
  </Placeholder>
)

const PostPlaceholder = () => (
  <>
    <PlaceholderHeader />
    <PlaceholderContent />
    <PlaceholderReactions />
  </>
)

export default React.memo(PostPlaceholder)
