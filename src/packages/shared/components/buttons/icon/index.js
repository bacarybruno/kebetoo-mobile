import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'

export default ({
  onPress,
  text,
  style,
  ...rest
}) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    {...rest}
  >
    <Ionicons
      style={styles.icon}
      name="ios-arrow-round-forward"
      size={30}
    />
  </TouchableOpacity>
)
