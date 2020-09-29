import React from 'react'
import { TouchableOpacity, ActivityIndicator } from 'react-native'

import { Typography } from '@app/shared/components'
import { colors } from '@app/theme'

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
    <Typography type={Typography.types.button} text={text.toUpperCase()} />
    <ActivityIndicator color={colors.primary} style={styles.loading} animating={loading} />
  </TouchableOpacity>
)

export default FullButton
