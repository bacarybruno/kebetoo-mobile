import React from 'react'
import { View } from 'react-native'

import styles from './styles'
import Text from '../text'

const Badge = ({ text, style }) => (
  <View style={[styles.wrapper, style]}>
    <Text color="white" bold size="sm" text={text} />
  </View>
)

export default React.memo(Badge)
