import React from 'react'
import { View } from 'react-native'

import styles from './styles'
import Typography, { types, weights } from '../typography'

const Badge = ({ text, style }) => (
  <View style={[styles.wrapper, style]}>
    <Typography type={types.headline5} text={text} color="white" systemWeight={weights.bold} />
  </View>
)

export default React.memo(Badge)
