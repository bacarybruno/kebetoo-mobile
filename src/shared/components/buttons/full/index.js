import React from 'react'
import { TouchableOpacity } from 'react-native'

import Typography, { types } from 'Kebetoo/src/shared/components/typography'

import styles from './styles'

const FullButton = ({
  onPress,
  text,
  style,
  ...rest
}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...rest}>
    <Typography type={types.button} text={text.toUpperCase()} />
  </TouchableOpacity>
)

export default FullButton
