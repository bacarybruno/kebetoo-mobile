import React from 'react'
import { View } from 'react-native'

import Typography, { types } from 'Kebetoo/src/shared/components/typography'

import styles from './styles'

const HrLine = ({ text, style }) => (
  <View style={[styles.wrapper, style]}>
    <View style={styles.line} />
    {text && <Typography type={types.separator} text={text} style={styles.text} />}
    <View style={styles.line} />
  </View>
)

export default HrLine
