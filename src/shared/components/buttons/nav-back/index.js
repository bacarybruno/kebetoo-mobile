import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import styles from './styles'

const NavBackButton = ({ style, onPress, ...rest }) => (
  <TouchableOpacity
    style={[styles.wrapper, style]}
    onPress={onPress}
    {...rest}
  >
    <Ionicon name="ios-arrow-back" size={30} />
  </TouchableOpacity>
)

export default NavBackButton
