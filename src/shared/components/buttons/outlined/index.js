import React from 'react'
import { TouchableNativeFeedback, ActivityIndicator } from 'react-native'

import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'
import Typography, { types } from '../../typography'

const OutlinedButton = ({
  text, onPress, style, disabled, loading = false,
}) => (
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

export default React.memo(OutlinedButton)
