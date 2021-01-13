import React from 'react'
import { TouchableOpacity } from 'react-native'

import Kebeticon from '@app/shared/icons/kebeticons'
import { edgeInsets } from '@app/theme'
import { Typography } from '@app/shared/components'
import { useAppColors } from '@app/shared/hooks'
import { abbreviateNumber } from '@app/shared/helpers/strings'

import styles from './styles'

const Reaction = ({
  iconName, count, onPress, color = 'reactions', ...otherProps
}) => {
  const { colors } = useAppColors()
  return (
    <TouchableOpacity
      style={styles.reaction}
      onPress={onPress}
      hitSlop={edgeInsets.symmetric({ horizontal: 5, vertical: 10 })}
      {...otherProps}
    >
      <Kebeticon color={colors[color]} style={styles.icon} size={18} name={iconName} />
      <Typography
        type={Typography.types.headline6}
        systemWeight={Typography.weights.bold}
        text={abbreviateNumber(count)}
        color={color}
      />
    </TouchableOpacity>
  )
}

export default Reaction
