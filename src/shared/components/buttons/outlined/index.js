import React from 'react'
import { TouchableNativeFeedback } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

const OutlinedButton = ({
  text, onPress, style, disabled,
}) => (
  <Pressable
    style={[styles.wrapper, style, disabled && { borderColor: colors.inactive }]}
    background={TouchableNativeFeedback.Ripple(colors.primary)}
    onPress={onPress}
    disabled={disabled}
  >
    <Text
      size="sm"
      text={text}
      color={disabled ? 'inactive' : 'primary'}
      bold
      uppercase
    />
  </Pressable>
)

export default React.memo(OutlinedButton)
