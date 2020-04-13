import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

export default ({ text, textStyle, style }) => (
  <View style={[styles.wrapper, style]}>
    <View style={styles.line} />
    {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    <View style={styles.line} />
  </View>
)
