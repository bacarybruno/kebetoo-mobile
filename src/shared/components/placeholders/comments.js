import React from 'react'
import { StyleSheet } from 'react-native'
import {
  Placeholder, PlaceholderMedia, PlaceholderLine, Fade,
} from 'rn-placeholder'

const styles = StyleSheet.create({
  placeholderIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  placeholderAvatar: {
    marginRight: 10,
  },
  placeholder: {
    height: 60,
  },
})

const PlaceholderIcon = () => (
  <PlaceholderMedia size={15} style={styles.placeholderIcon} />
)

const PlaceholderAvatar = () => (
  <PlaceholderMedia isRound style={styles.placeholderAvatar} />
)

const CommentPlaceholder = () => (
  <Placeholder
    style={styles.placeholder}
    Animation={Fade}
    Left={PlaceholderAvatar}
    Right={PlaceholderIcon}
  >
    <PlaceholderLine height={8} width={50} />
    <PlaceholderLine height={10} style={{ marginBottom: 5 }} />
    <PlaceholderLine height={10} />
  </Placeholder>
)

export default React.memo(CommentPlaceholder)
