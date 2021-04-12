import { memo } from 'react'
import { StyleSheet } from 'react-native'
import {
  Placeholder, PlaceholderMedia, PlaceholderLine, Fade,
} from 'rn-placeholder'

import { useAppColors, useAppStyles } from '@app/shared/hooks'
import { metrics } from '@app/theme'

export const createThemedStyles = (colors) => StyleSheet.create({
  placeholderIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  placeholderAvatar: {
    marginRight: metrics.spacing.sm,
  },
  placeholder: {
    height: 60,
  },
  background: {
    backgroundColor: colors.colorScheme === 'dark' ? colors.background : undefined,
  },
})

const PlaceholderIcon = () => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <PlaceholderMedia size={15} style={[styles.placeholderIcon, styles.background]} />
  )
}

const PlaceholderAvatar = () => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <PlaceholderMedia isRound style={[styles.placeholderAvatar, styles.background]} />
  )
}

export const Animation = (props) => {
  const { colors } = useAppColors()
  return (
    <Fade
      {...props}
      style={colors.colorScheme === 'dark' && { backgroundColor: colors.backgroundSecondary }}
    />
  )
}

export const CommentPlaceholder = () => {
  const styles = useAppStyles(createThemedStyles)
  return (
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
}

export default memo(CommentPlaceholder)
