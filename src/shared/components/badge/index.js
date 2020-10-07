import React from 'react'
import { View } from 'react-native'

import { colors } from '@app/theme'

import styles from './styles'
import Typography, { types, weights } from '../typography'

const getBackgroundColor = (primary) => ({
  backgroundColor: primary ? colors.primary : colors.secondary,
})

const Badge = ({
  text, style, primary, typography,
}) => (
  <View style={[styles.wrapper, getBackgroundColor(primary), style]}>
    <Typography
      type={typography || types.headline5}
      text={text}
      color={primary ? 'white' : 'primary'}
      systemWeight={weights.bold}
    />
  </View>
)

export default React.memo(Badge)
