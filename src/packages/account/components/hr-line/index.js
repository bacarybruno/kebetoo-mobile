import React from 'react'
import { View } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'

const HrLine = ({ text, style }) => (
  <View style={[styles.wrapper, style]}>
    <View style={styles.line} />
    {text && <Text style={styles.text} size="sm" text={text} />}
    <View style={styles.line} />
  </View>
)

export default HrLine
