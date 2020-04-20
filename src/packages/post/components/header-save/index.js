import React from 'react'
import { TouchableOpacity } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'

export default ({ onPress }) => (
  <TouchableOpacity style={styles.wrapper} onPress={onPress}>
    <Text style={styles.text} bold text="POST" color="primary" uppercase />
  </TouchableOpacity>
)
