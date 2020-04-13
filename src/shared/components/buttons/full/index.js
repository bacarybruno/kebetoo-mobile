import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

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
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
)
