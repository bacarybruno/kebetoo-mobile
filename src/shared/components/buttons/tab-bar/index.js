import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'


export default ({ onPress = () => { } }) => (
  <View style={styles.wrapper}>
    <TouchableOpacity
      onPress={onPress}
      underlayColor={colors.black}
      style={styles.container}
      activeOpacity={0.6}
    >
      <Ionicon name="md-add" size={24} color={colors.white} />
    </TouchableOpacity>
  </View>
)
