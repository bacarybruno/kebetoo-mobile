import React, { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import colors from 'Kebetoo/src/theme/colors'
import Ionicon from 'react-native-vector-icons/Ionicons'

import styles from './styles'

const SendButton = ({ onPress }) => (
  <TouchableOpacity style={styles.send} onPress={onPress}>
    <Ionicon style={styles.sendIcon} name="md-send" size={25} color={colors.white} />
  </TouchableOpacity>
)

export default memo(SendButton)
