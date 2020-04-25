import React from 'react'
import { TouchableOpacity } from 'react-native'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'

import styles from './styles'

const NavBackButton = ({ style, onPress, ...rest }) => (
  <TouchableOpacity
    style={[styles.wrapper, style]}
    onPress={onPress}
    {...rest}
  >
    <Kebeticon name="chevron-left" size={20} />
  </TouchableOpacity>
)

export default NavBackButton
