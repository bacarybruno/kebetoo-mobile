import React from 'react'
import { View } from 'react-native'
import colors from '@app/theme/colors'

import styles from './styles'
import Typography, { types, weights } from '../typography'

const getBackgroundColor = (primary) => ({
  backgroundColor: primary ? colors.primary : colors.secondary,
})

const Badge = ({ text, style, primary }) => (
  <View style={[styles.wrapper, getBackgroundColor(primary), style]}>
    <Typography
      type={types.headline5}
      text={text}
      color={primary ? 'white' : 'primary'}
      systemWeight={weights.bold}
    />
  </View>
)

export default React.memo(Badge)
