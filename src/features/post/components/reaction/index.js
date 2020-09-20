import React from 'react'
import { TouchableOpacity } from 'react-native'

import Kebeticon from '@app/shared/icons/kebeticons'
import { colors, edgeInsets } from '@app/theme'
import Typography, { types, weights } from '@app/shared/components/typography'

import styles from './styles'

const Reaction = ({
  iconName, count, onPress, color = 'reactions', ...otherProps
}) => (
  <TouchableOpacity
    style={styles.reaction}
    onPress={onPress}
    hitSlop={edgeInsets.symmetric({ horizontal: 5, vertical: 10 })}
    {...otherProps}
  >
    <Kebeticon color={colors[color]} style={styles.icon} size={18} name={iconName} />
    <Typography type={types.headline6} systemWeight={weights.bold} text={count} color={color} />
  </TouchableOpacity>
)

export default Reaction
