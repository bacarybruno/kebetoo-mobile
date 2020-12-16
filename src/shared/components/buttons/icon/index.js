import { useAppStyles } from '@app/shared/hooks'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import createThemedStyles from './styles'

const IconButton = ({
  onPress,
  text,
  style,
  iconName,
  ...rest
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...rest}>
      <Ionicon style={styles.icon} name={iconName} size={30} />
    </TouchableOpacity>
  )
}

export default IconButton
