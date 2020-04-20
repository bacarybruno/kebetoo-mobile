import React from 'react'
import { View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import styles from './styles'

const HeaderBack = ({ tintColor }) => (
  <View style={styles.wrapper}>
    <Ionicon name="ios-close" color={tintColor} size={40} />
  </View>
)

export default HeaderBack
