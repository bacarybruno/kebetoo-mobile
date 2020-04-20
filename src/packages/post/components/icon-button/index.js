import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

const IconButton = ({
  onPress,
  name,
  style,
  color = colors.blue_dark,
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Ionicon name={name} size={20} color={color} />
  </TouchableOpacity>
)

export default IconButton
