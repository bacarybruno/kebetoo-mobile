import React from 'react'
import { View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Kebeticon from '@app/shared/icons/kebeticons'

import styles from './styles'

const Wrapper = ({ children, style }) => (
  <View style={[styles.wrapper, style]}>{children}</View>
)

const HeaderBack = ({ tintColor, style }) => (
  <Wrapper style={style}>
    <Kebeticon name="chevron-left" color={tintColor} size={20} />
  </Wrapper>
)

HeaderBack.Close = ({ tintColor, style }) => (
  <Wrapper style={style}>
    <Ionicon name="ios-close" color={tintColor} size={30} />
  </Wrapper>
)

export default HeaderBack
