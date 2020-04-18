import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'


export default ({ onPress }) => (
  <View style={{ flex: 1 }}>
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicon name="md-add" size={24} color={colors.white} />
        </View>
      </View>
    </TouchableOpacity>
  </View>
)
