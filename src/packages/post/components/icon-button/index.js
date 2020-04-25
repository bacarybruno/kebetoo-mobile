import React from 'react'
import { TouchableOpacity } from 'react-native'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

const IconButton = ({
  onPress,
  name,
  style,
  color = colors.blue_dark,
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Kebeticon name={name} size={18} color={color} />
  </TouchableOpacity>
)

export default IconButton
