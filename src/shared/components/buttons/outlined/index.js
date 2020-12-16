import React from 'react'
import { TouchableNativeFeedback, ActivityIndicator } from 'react-native'

import { Pressable } from '@app/shared/components'
import { colors } from '@app/theme'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'
import Typography, { types } from '../../typography'

const OutlinedButton = ({
  text, onPress, style, disabled, loading = false,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <Pressable
      style={[styles.wrapper, style, disabled && { borderColor: colors.inactive }]}
      background={TouchableNativeFeedback.Ripple(colors.primary)}
      onPress={onPress}
      disabled={disabled}
    >
      {loading
        ? <ActivityIndicator animating={loading} color={colors.primary} />
        : <Typography type={types.button} text={text} color={disabled ? 'inactive' : 'primary'} />}
    </Pressable>
  )
}

export default React.memo(OutlinedButton)
