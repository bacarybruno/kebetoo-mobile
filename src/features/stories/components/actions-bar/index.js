import { isValidElement, memo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { Typography } from '@app/shared/components'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles, { iconSize } from './styles'

const StoryReaction = ({ icon, value, active, activeColor, onPress, disabled }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={[styles.reaction, disabled && styles.disabled]}>
        {isValidElement(icon) && icon}
        {!isValidElement(icon) && icon && (
          <Ionicon
            name={active ? icon : `${icon}-outline`}
            color={active ? activeColor : colors.white}
            size={iconSize}
            style={styles.icon}
          />
        )}
        {!!value && (
          <Typography
            text={value}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.text, styles.icon]}
            systemWeight={active ? Typography.weights.semibold : Typography.weights.regular}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

const StoryViewActionBar = ({ actions, style, position = StoryViewActionBar.Positions.Right }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <View
      style={[
        styles.reactions,
        position === StoryViewActionBar.Positions.Left
          ? styles.left
          : styles.right,
        style
      ]}
    >
      {actions.map((action) => (
        <StoryReaction
          icon={action.icon}
          value={action.text}
          active={action.active}
          onPress={action.onPress}
          disabled={action.disabled}
          activeColor={action.activeColor || colors.white}
        />
      ))}
    </View>
  )
}

StoryViewActionBar.Positions = {
  Left: 'StoryViewActionBar.Positions.Left',
  Right: 'StoryViewActionBar.Positions.Right'
}

export default StoryViewActionBar

