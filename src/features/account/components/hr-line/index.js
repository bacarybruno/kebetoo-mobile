import React from 'react'
import { View } from 'react-native'

import { Typography } from '@app/shared/components'

import styles from './styles'

const HrLine = ({ text, style }) => (
  <View style={[styles.wrapper, style]}>
    <View style={styles.line} />
    {text && <Typography type={Typography.types.separator} text={text} style={styles.text} />}
    <View style={styles.line} />
  </View>
)

export default HrLine
