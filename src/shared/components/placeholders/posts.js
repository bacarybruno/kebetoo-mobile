import { memo } from 'react'
import { View } from 'react-native'
import { Placeholder, PlaceholderMedia, PlaceholderLine } from 'rn-placeholder'

import { useAppStyles } from '@app/shared/hooks'
import { metrics } from '@app/theme'

import { Animation, createThemedStyles } from './comments'

export const PlaceholderAvatar = ({ size }) => {
  const styles = useAppStyles(createThemedStyles)
  const style = { marginRight: metrics.spacing.sm, ...styles.background }
  return (
    <PlaceholderMedia size={size} isRound style={style} />
  )
}

const createAvatar = (size) => (props) => (
  <PlaceholderAvatar {...props} size={size} />
)

export const PlaceholderHeader = ({ avatarSize }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <Placeholder Animation={Animation} Left={createAvatar(avatarSize)}>
      <View style={{ height: avatarSize, marginBottom: metrics.spacing.sm }}>
        <PlaceholderLine style={styles.background} height={10} width={50} />
        <PlaceholderLine style={styles.background} height={10} width={30} />
      </View>
    </Placeholder>
  )
}

const PlaceholderContent = () => {
  const styles = useAppStyles(createThemedStyles)
  const style = {
    marginBottom: metrics.spacing.sm,
    borderRadius: metrics.radius.sm,
    ...styles.background,
  }
  return (
    <Placeholder Animation={Animation}>
      <PlaceholderLine
        height={52}
        style={style}
      />
    </Placeholder>
  )
}

const PlaceholderReaction = () => {
  const styles = useAppStyles(createThemedStyles)
  const style = { marginRight: metrics.spacing.sm, ...styles.background }
  return (
    <PlaceholderLine width={15} height={20} style={style} />
  )
}

const PlaceholderReactions = () => (
  <Placeholder Animation={Animation} style={{ marginBottom: metrics.spacing.xl }}>
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

export default memo(PostPlaceholder)
