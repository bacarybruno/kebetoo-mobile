import React from 'react'
import { TouchableOpacity } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'

export default ({
  onPress,
  text,
  style,
  ...rest
}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...rest}>
    <Text color="white" text={text} />
  </TouchableOpacity>
)