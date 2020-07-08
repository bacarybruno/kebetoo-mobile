import React from 'react'
import { StyleSheet, Appearance } from 'react-native'
import {
  Placeholder, PlaceholderMedia, PlaceholderLine, Fade,
} from 'rn-placeholder'

import colors from 'Kebetoo/src/theme/colors'

const colorScheme = Appearance.getColorScheme()

export const styles = StyleSheet.create({
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
  background: {
    backgroundColor: colorScheme === 'dark' ? colors.background : undefined,
  },
})

const PlaceholderIcon = () => (
  <PlaceholderMedia size={15} style={[styles.placeholderIcon, styles.background]} />
)

const PlaceholderAvatar = () => (
  <PlaceholderMedia isRound style={[styles.placeholderAvatar, styles.background]} />
)

export const Animation = (props) => (
  <Fade {...props} style={colorScheme === 'dark' && { backgroundColor: colors.backgroundSecondary }} />
)

const CommentPlaceholder = () => (
  <Placeholder
    style={styles.placeholder}
    Animation={Animation}
    Left={PlaceholderAvatar}
    Right={PlaceholderIcon}
  >
    <PlaceholderLine style={styles.background} height={8} width={50} />
    <PlaceholderLine style={[styles.background, { marginBottom: 5 }]} height={10} />
    <PlaceholderLine style={styles.background} height={10} />
  </Placeholder>
)

export default React.memo(CommentPlaceholder)
