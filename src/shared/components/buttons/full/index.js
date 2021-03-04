import React from 'react'
import { TouchableOpacity, ActivityIndicator } from 'react-native'

import { Typography } from '@app/shared/components'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const FullButton = ({
  onPress,
  text,
  style,
  loading = false,
  disabled = false,
  ...rest
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  const isDisabled = disabled || loading
  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.button, isDisabled && styles.disabledButton, style]}
      onPress={onPress}
      {...rest}
    >
      <Typography type={Typography.types.button} text={text.toUpperCase()} />
      <ActivityIndicator color={colors.primary} style={styles.loading} animating={loading} />
    </TouchableOpacity>
  )
}

export default FullButton
