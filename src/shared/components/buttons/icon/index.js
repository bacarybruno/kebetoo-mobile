import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import styles from './styles'

export default ({
  onPress,
  text,
  style,
  iconName,
  ...rest
}) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    {...rest}
  >
    <Ionicon
      style={styles.icon}
      name={iconName}
      size={30}
    />
  </TouchableOpacity>
)
