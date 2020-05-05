import React from 'react'
import { View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'

import styles from './styles'

const Wrapper = ({ children }) => (
  <View style={styles.wrapper}>{children}</View>
)

const HeaderBack = ({ tintColor }) => (
  <Wrapper>
    <Kebeticon name="chevron-left" color={tintColor} size={20} />
  </Wrapper>
)

HeaderBack.Close = ({ tintColor }) => (
  <Wrapper>
    <Ionicon name="ios-close" color={tintColor} size={40} />
  </Wrapper>
)

export default HeaderBack
