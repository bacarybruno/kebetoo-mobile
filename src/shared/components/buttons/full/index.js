import React from 'react'
import { TouchableOpacity, ActivityIndicator } from 'react-native'

import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

const FullButton = ({
  onPress,
  text,
  style,
  loading = false,
  disabled = false,
  ...rest
}) => (
  <TouchableOpacity
    disabled={disabled}
    style={[styles.button, (disabled || loading) && styles.disabledButton, style]}
    onPress={onPress}
    {...rest}
  >
    <Typography type={types.button} text={text.toUpperCase()} />
    <ActivityIndicator color={colors.primary} style={styles.loading} animating={loading} />
  </TouchableOpacity>
)

export default FullButton
